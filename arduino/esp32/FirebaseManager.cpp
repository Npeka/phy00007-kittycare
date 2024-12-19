#include "FirebaseManager.h"

void asyncCB(AsyncResult &aResult);
void printResult(AsyncResult &aResult);

FirebaseManager::FirebaseManager(
    const String &databaseUrl,
    const String &apiKey,
    const String &projectId,
    const String &userId,
    const String &userEmail,
    const String &userPassword,
    const String &catId)
    : databaseUrl(databaseUrl),
      apiKey(apiKey),
      projectId(projectId),
      userId(userId),
      catId(catId),
      network(DefaultNetwork()),
      userAuth(UserAuth(apiKey, userEmail, userPassword)),
      app(FirebaseApp()),
      sslClient(WiFiClientSecure()),
      aClient(AsyncClient(sslClient, getNetwork(network))),
      database(RealtimeDatabase()),
      status(StaticJsonDocument<256>()),
      autodev(StaticJsonDocument<256>()),
      env(StaticJsonDocument<256>()),
      error(DeserializationError::Ok),
      errorA(DeserializationError::Ok),
      docs(Firestore::Documents()) {}

void FirebaseManager::init() {
  sslClient.setInsecure();
  initializeApp(aClient, app, getAuth(userAuth), asyncCB, FirebaseManager::getNameAuth().c_str());
  app.getApp<RealtimeDatabase>(database);
  app.getApp<Firestore::Documents>(docs);
  database.url(databaseUrl);
}

void FirebaseManager::loop() {
  app.loop();
  database.loop();
  docs.loop();
}

bool FirebaseManager::isReady() {
  return app.ready();
}

void FirebaseManager::getDevicesStatus() {
  String path = "/" + userId + "/devices";
  database.get(aClient, path.c_str(), asyncCB, false, FirebaseManager::getNameGetStatus().c_str());
}

void FirebaseManager::getDevicesAuto() {
  String path = "/" + userId + "/auto";
  database.get(aClient, path.c_str(), asyncCB, false, FirebaseManager::getNameGetAuto().c_str());
}

void FirebaseManager::parseDevicesStatus(const String &jsonStatus) {
  error = deserializeJson(status, jsonStatus);
}

void FirebaseManager::parseDevicesAuto(const String &jsonAuto) {
  errorA = deserializeJson(autodev, jsonAuto);
}

bool FirebaseManager::isErrorParsingStatus() const {
  return error != DeserializationError::Ok;
}

bool FirebaseManager::isErrorParsingAuto() const {
  return errorA != DeserializationError::Ok;
}

void FirebaseManager::updateDeviceStatus(const String &device) {
  char jsonChar[128];
  serializeJson(status[device], jsonChar);
  object_t jsonObject;
  JsonWriter writer;
  writer.create(jsonObject, "/devices/" + device, jsonChar);
  String path = "/" + userId;
  database.update(aClient, path.c_str(), jsonObject, asyncCB,
                  FirebaseManager::getNameUpdateStatus().c_str());
  error = DeserializationError::Ok;
}

void FirebaseManager::updateDevicesStatus() {
  char jsonChar[256];
  serializeJson(status, jsonChar);
  object_t jsonObject;
  JsonWriter writer;
  writer.create(jsonObject, "/devices", jsonChar);
  String path = "/" + userId;
  database.update(aClient, path.c_str(), jsonObject, asyncCB,
                  FirebaseManager::getNameUpdateStatus().c_str());
  error = DeserializationError::Ok;
}

void FirebaseManager::updateEnvironment() {
  char jsonChar[256];
  serializeJson(env, jsonChar);
  object_t jsonObject;
  JsonWriter writer;
  writer.create(jsonObject, "/environment", jsonChar);
  String path = "/" + userId;
  database.update(aClient, path.c_str(), jsonObject, asyncCB,
                  FirebaseManager::getNameUpdateEnvironment().c_str());
}

void FirebaseManager::updateFoodAndDrinkDoc(const float &food, const float &drink) {
  String catRefPath = "projects/";
  catRefPath += projectId;
  catRefPath += "/databases/(default)/documents/cats/";
  catRefPath += catId;

  Values::ReferenceValue catRef(catRefPath);
  Values::DoubleValue drinkValue(drink);
  Values::DoubleValue foodValue(food);

  time_t now = time(nullptr);
  struct tm *utcTime = gmtime(&now);
  char buf[30];
  snprintf(buf, sizeof(buf), "%04d-%02d-%02dT%02d:%02d:%02dZ",
           utcTime->tm_year + 1900,
           utcTime->tm_mon + 1,
           utcTime->tm_mday,
           utcTime->tm_hour,
           utcTime->tm_min,
           utcTime->tm_sec);
  Values::TimestampValue dateValue(buf);

  Document<Values::Value> doc("cat", Values::Value(catRef));
  doc.add("drink", Values::Value(drinkValue));
  doc.add("food", Values::Value(foodValue));
  doc.add("date", Values::Value(dateValue));

  String collectionPath = "health";

  docs.createDocument(aClient, Firestore::Parent(projectId), collectionPath, DocumentMask(), doc, asyncCB,
                      FirebaseManager::getNameCreateDocHealth().c_str());
}

void FirebaseManager::updateEnvironmentDoc(const float &humidity, const float &temperature) {
  String catRefPath = "projects/";
  catRefPath += projectId;
  catRefPath += "/databases/(default)/documents/cats/";
  catRefPath += catId;

  Values::ReferenceValue catRef(catRefPath);
  Values::DoubleValue humidityValue(humidity);
  Values::DoubleValue temperatureValue(temperature);

  time_t now = time(nullptr);
  struct tm *utcTime = gmtime(&now);
  char buf[30];
  snprintf(buf, sizeof(buf), "%04d-%02d-%02dT%02d:%02d:%02dZ",
           utcTime->tm_year + 1900,
           utcTime->tm_mon + 1,
           utcTime->tm_mday,
           utcTime->tm_hour,
           utcTime->tm_min,
           utcTime->tm_sec);
  Values::TimestampValue dateValue(buf);

  Document<Values::Value> doc("cat", Values::Value(catRef));
  doc.add("temp", Values::Value(temperatureValue));
  doc.add("humid", Values::Value(humidityValue));
  doc.add("date", Values::Value(dateValue));

  String collectionPath = "env";

  docs.createDocument(aClient, Firestore::Parent(projectId), collectionPath, DocumentMask(), doc, asyncCB,
                      FirebaseManager::getNameCreateDocEnv().c_str());
}

String FirebaseManager::getName() const {
  return "firebase_manager";
}

String FirebaseManager::getNameAuth() const {
  return "firebase_auth";
}

String FirebaseManager::getNameGetStatus() const {
  return "firebase_get_status";
}

String FirebaseManager::getNameGetAuto() const {
  return "firebase_get_auto";
}

String FirebaseManager::getNameUpdateStatus() const {
  return "firebase_update_status";
}

String FirebaseManager::getNameUpdateEnvironment() const {
  return "firebase_update_environment";
}

String FirebaseManager::getNameCreateDocHealth() const {
  return "firebase_create_doc_health";
}

String FirebaseManager::getNameCreateDocEnv() const {
  return "firebase_create_doc_env";
}
