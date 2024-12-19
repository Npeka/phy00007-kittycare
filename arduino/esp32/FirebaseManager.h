#ifndef FIREBASE_MANAGER_H
#define FIREBASE_MANAGER_H

#include <Arduino.h>
#include <ArduinoJson.h>
#include <FirebaseClient.h>
#include <WiFiClientSecure.h>
#include <time.h>

using AsyncClient = AsyncClientClass;

void asyncCB(AsyncResult &aResult);
void printResult(AsyncResult &aResult);

class FirebaseManager {
private:
  String databaseUrl;
  String apiKey;
  String projectId;
  String userId;
  String catId;
  DefaultNetwork network;
  UserAuth userAuth;
  FirebaseApp app;
  WiFiClientSecure sslClient;
  AsyncClient aClient;
  RealtimeDatabase database;
  StaticJsonDocument<256> status;
  StaticJsonDocument<256> autodev;
  StaticJsonDocument<256> env;
  DeserializationError error;
  DeserializationError errorA;
  Firestore::Documents docs;

public:
  FirebaseManager(const String &databaseUrl,
                  const String &apiKey,
                  const String &projectId,
                  const String &userId,
                  const String &userEmail,
                  const String &userPassword,
                  const String &catId);
  ~FirebaseManager() = default;
  void init();
  void loop();
  bool isReady();
  void getDevicesStatus();
  void getDevicesAuto();
  void parseDevicesStatus(const String &jsonStatus);
  void parseDevicesAuto(const String &jsonAuto);
  bool isErrorParsingStatus() const;
  bool isErrorParsingAuto() const;

  template <typename T>
  T getDeviceStatus(const String &device) const;
  template <typename T>
  T getDeviceAuto(const String &device) const;
  template <typename T>
  void setDeviceStatus(const String &device, const T &value);
  template <typename T>
  void setDeviceAuto(const String &device, const T &value);
  template <typename T>
  void setEnvironment(const String &device, const T &value);

  void updateDeviceStatus(const String &device);
  void updateDevicesStatus();
  void updateEnvironment();
  void updateFoodAndDrinkDoc(const float &food, const float &drink);
  void updateEnvironmentDoc(const float &humidity, const float &temperature);

  String getName() const;
  String getNameAuth() const;
  String getNameGetStatus() const;
  String getNameGetAuto() const;
  String getNameUpdateStatus() const;
  String getNameUpdateEnvironment() const;
  String getNameCreateDocHealth() const;
  String getNameCreateDocEnv() const;
};

template <typename T>
T FirebaseManager::getDeviceStatus(const String &device) const {
  return this->status[device].as<T>();
}

template <typename T>
T FirebaseManager::getDeviceAuto(const String &device) const {
  return this->autodev[device].as<T>();
}

template <typename T>
void FirebaseManager::setDeviceAuto(const String &device, const T &value) {
  this->autodev[device] = value;
}

template <typename T>
void FirebaseManager::setDeviceStatus(const String &device, const T &value) {
  this->status[device] = value;
}

template <typename T>
void FirebaseManager::setEnvironment(const String &device, const T &value) {
  this->env[device] = value;
}

#endif
