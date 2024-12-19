// Wi-Fi
#include <WiFi.h>
const char *ssid = "Dooing Coffee Lab";
const char *password = "dooingxinchao";

// Firebase
#include "FirebaseManager.h"

// Firebase configuration
#define DATABASE_URL "https://phy00007-kittycare-12b76-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define API_KEY "AIzaSyDkyy9evQOLVbS3s_bEAr42wEMYy5MdXio"
#define PROJECT_ID "phy00007-kittycare-12b76"
#define USER_ID "BGAH9swYkQM8hwkguIYf35kE3Xf1"
#define USER_EMAIL "huynhyenngoc1910@gmail.com"
#define USER_PASSWORD "19102004"
#define CAT_ID "sQ5DmE4ijSZYd7AShiyc"
FirebaseManager fm(DATABASE_URL, API_KEY, PROJECT_ID, USER_ID, USER_EMAIL, USER_PASSWORD, CAT_ID);

// 1.1 refill thức ăn - Stepper Motor, Loadcell
#include "RefillFood.h"
#define SERVO_PIN 33
#define TURN_TIME 225
#define DT 19
#define _SCK 18
RefillFood refillFood(SERVO_PIN, TURN_TIME, DT, _SCK);
// // 1.2 Water Sensor, Mini Water Pump, Relay
#include "RefillWater.h"
#define RELAY_PIN 16
#define SENSOR_PIN 36
#define POWER_PIN 17
#define VOLUME_THRESHOLD 500
RefillWater refillWater(RELAY_PIN, SENSOR_PIN, POWER_PIN, VOLUME_THRESHOLD);

// Chức năng 2: bảo vệ & theo dõi hoạt động
#include "Protect.h"
#define TRIG_PIN 32
#define ECHO_PIN 35
#define LED_PIN 22
#define BUZZER_PIN 23
Protect protect(TRIG_PIN, ECHO_PIN, LED_PIN, BUZZER_PIN);

// Chức năng 3: Laser
#include "Laser.h"
#define LASER_PIN 26
Laser laser(LASER_PIN);

// Chức năng 4: bật quạt & đèn tự động
// 4.1 quạt - Fan - Relay - chân 25 hỗ trợ ouput
#include "Fan.h"
#define FAN_PIN 14
Fan fan(FAN_PIN);
// 4.2 đèn - Led, Photoresistor Sensor
#include "Light.h"
#define LED_PIN_2 27
#define LDR_PIN 39
Light light(LED_PIN_2, LDR_PIN);

// Chức năng 5: đóng cửa chuồng - Servo
#include "Door.h"
#define SERVO_PIN_2 25
#define TURN_TIME_2 225
Door door(SERVO_PIN_2, TURN_TIME_2);

// Chức năng 6: đo sức khỏe - AI
// nhiệt độ độ ẩm - Temperature & Humidity Sensor
#include "HumiTemp.h"
#define DHT_PIN 21
HumiTemp dht(DHT_PIN);

#include "Logger.h"
Logger logger;

#include "DailyTaskScheduler.h"
DailyTaskScheduler dts;

void setup() {
  Serial.begin(115200);

  // wifi
  WiFi.begin(ssid, password);
  WiFi.setSleep(false);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  logger.device("WiFi");
  logger.status("Connected");

  configTime(7 * 3600, 0, "pool.ntp.org");
  while (!time(nullptr)) {
    delay(1000);
  }

  refillFood.init();
  refillWater.init();
  protect.init();
  laser.init();
  fan.init();
  light.init();
  door.init();
  dht.init();

  // firebase
  fm.init();
  fm.setDeviceAuto(protect.getName(), false);
  fm.setDeviceAuto(door.getName(), false);
  fm.setDeviceAuto(fan.getName(), false);
  fm.setDeviceAuto(light.getName(), false);

  fm.setDeviceStatus(refillFood.getName(), refillFood.getStatus());
  fm.setDeviceStatus(refillWater.getName(), refillWater.getStatus());
  fm.setDeviceStatus(protect.getName(), protect.getStatus());
  fm.setDeviceStatus(laser.getName(), laser.getStatus());
  fm.setDeviceStatus(fan.getName(), fan.getStatus());
  fm.setDeviceStatus(light.getName(), light.getLight());
  fm.setDeviceStatus(door.getName(), door.getStatus());

  fm.setEnvironment(refillFood.getNameFood(), refillFood.getSum());
  fm.setEnvironment(refillWater.getNameDrink(), refillWater.getSum());
  fm.setEnvironment(dht.getNameHumidity(), dht.getHumidity());
  fm.setEnvironment(dht.getNameTemperature(), dht.getTemperature());
}

const unsigned long updateInterval = 5000;
// Firebase
unsigned long lastGetStatusTime = 0;
unsigned long lastGetAutoTime = 0;
unsigned long lastUpdateStatusTime = 0;
unsigned long lastUpdateEnvTime = 0;
uint8_t isGetDone = true;
uint8_t isGetAutoDone = true;
uint8_t isUpdateDone = true;
uint8_t isUpdateEnvDone = true;
// RefillWater

void loop() {

  fm.loop();
  logger.device(fm.getName());
  if (fm.isReady()) {
    logger.status("Ready");
    logger.beginLoop();

    // 1.1 Stepper Motor, loadcell
    // [Firebase]: read/write
    // [Value]: true/false
    // [Value][2]: float
    // [Status]: on/off
    logger.device(refillFood.getName());
    float g = refillFood.getWeight();
    refillFood.readWeight();
    logger.value(g);
    float g_now = refillFood.getWeight();
    logger.value(g_now);
    if (g_now < g && g - g_now > 3) {
      logger.value(g - g_now);
      refillFood.sum(g - g_now);
      fm.setEnvironment(
          refillFood.getNameFood(),
          refillFood.getSum());
    }
    if (refillFood.isLow() || refillFood.getStatus()) {
      logger.status("On", false);
      // refillFood.on();
      delay(3000);
      logger.status("Off");
      // refillFood.off();
    }
    // 1.2 Water Sensor, Mini Water Pump, Relay
    // [Firebase]: read/write
    // [Value]: true/false
    // [Value][2]: float
    // [Status]: on/off
    logger.device(refillWater.getName());
    uint16_t ml = refillWater.getVolume();
    logger.value(ml);
    refillWater.readVolume();
    uint16_t ml_now = refillWater.getVolume();
    logger.value(ml_now);
    logger.value(ml - ml_now);
    if (ml > ml_now && ml - ml_now > 20) {
      refillWater.sum(ml - ml_now);
      fm.setEnvironment(
          refillWater.getNameDrink(),
          refillWater.getSum());
    }
    if ((refillWater.isLow() || refillWater.getStatus()) && !refillWater.isHigh()) {
      logger.status("On", false);
      refillWater.on();
      delay(3000);
      logger.status("Off");
      refillWater.off();
    } else {
      logger.status("Off");
      refillWater.off();
    }

    // 2. Bảo vệ & theo dõi hoạt động
    // [Firebase]: write - only
    // [Value]: true/false
    // [Status]: on/off
    logger.device(protect.getName());
    protect.readDistanceCM();
    logger.value(protect.getDistance());
    if (protect.isFar() && fm.getDeviceAuto<bool>(protect.getName())) {
      logger.status("Far");
      protect.on();
    } else {
      logger.status("Near or Auto off");
      protect.off();
    }

    // 3. Laser
    // [Firebase]: read - only
    // [Value]: true/false
    // [Status]: on/off
    logger.device(laser.getName());
    if (laser.getStatus()) {
      logger.status("On");
      laser.on();
    } else {
      logger.status("Off");
      laser.off();
    }

    // 4.2 Đèn
    // [Firebase]: read/write
    // [Value]: true/false
    // [Status]: on/off
    logger.device(light.getName());
    logger.value(light.getLight());
    light.readLight();
    if (fm.getDeviceAuto<bool>(light.getName())) {
      if (light.isLight()) {
        logger.status("Light");
        light.off();
      } else {
        logger.status("Dark");
        light.on();
      }
    } else {
      if (light.getStatus()) {
        logger.status("On");
        light.on();
      } else {
        logger.status("Off");
        light.off();
      }
    }

    // 5. Đóng cửa chuồng
    // [Firebase]: read/write
    // [Value]: true/false
    // [Status]: opened/closed
    if (fm.getDeviceAuto<bool>(door.getName())) {
      if (dts.isNeedToCloseDoor() && door.getStatus()) {
        logger.deviceControl(dts.getName(), door.getName());
        logger.status("Closed");
        door.close();
      }
      fm.setDeviceStatus(door.getName(), door.getStatus());
    } else {
      logger.device(door.getName());
      if (door.getStatus() && !door.getLastStatus()) {
        logger.status("Opened");
        door.open();
      } else if (!door.getStatus() && door.getLastStatus()) {
        logger.status("Closed");
        door.close();
      } else {
        logger.status("No change");
      }
    }

    // 6. Đo sức khỏe - AI
    // [Firebase]: write - only
    // [Value]: float/float
    logger.device(dht.getName(), false, true);
    dht.readHumidity();
    dht.readTemperature();
    if (dht.isReady()) {
      float h = dht.getHumidity();
      float t = dht.getTemperature();

      logger.device(dht.getNameHumidity(), true);
      logger.value(h, true);

      logger.device(dht.getNameTemperature(), true);
      logger.value(t, true);

      fm.setEnvironment(dht.getNameHumidity(), h);
      fm.setEnvironment(dht.getNameTemperature(), t);

      // 4.1 Quạt
      // [Firebase]: read/write
      // [Value]: true/false
      // [Status]: on/off
      // [DiviceControl]: dht.isHot()
      if (fm.getDeviceAuto<bool>(fan.getName())) {
        logger.deviceControl(dht.getName(), fan.getName());
        if (dht.isHot()) {
          logger.status("On");
          fan.on();
        } else {
          logger.status("Off");
          fan.off();
        }
      } else {
        logger.device(fan.getName());
        if (fan.getStatus()) {
          logger.status("On");
          fan.on();
        } else {
          logger.status("Off");
          fan.off();
        }
      }
    } else {
      logger.error("DHT is not ready");
    }

    if (dts.isNeedToRunTask()) {
      logger.device(dts.getName());
      logger.status("Updating food and drink yesterday...");
      fm.updateFoodAndDrinkDoc(
          refillFood.getSum(),
          refillWater.getSum());
      refillFood.resetSum();
      refillWater.resetSum();

      logger.device(dts.getName());
      logger.status("Updating environment yesterday...");
      fm.updateEnvironmentDoc(
          dht.getHumidity(),
          dht.getTemperature());
    }

    unsigned long currentMillis = millis();

    // Update devices status
    if (isGetDone) {
      uint8_t isUpdate = false;

      if (refillFood.getStatus() != fm.getDeviceStatus<bool>(refillFood.getName())) {
        fm.setDeviceStatus(refillFood.getName(), refillFood.getStatus());
        isUpdate = true;
      }

      if (refillWater.getStatus() != fm.getDeviceStatus<bool>(refillWater.getName())) {
        fm.setDeviceStatus(refillWater.getName(), refillWater.getStatus());
        isUpdate = true;
      }

      if (protect.getStatus() != fm.getDeviceStatus<bool>(protect.getName())) {
        fm.setDeviceStatus(protect.getName(), protect.getStatus());
        isUpdate = true;
      }

      if (fan.getStatus() != fm.getDeviceStatus<bool>(fan.getName())) {
        fm.setDeviceStatus(fan.getName(), fan.getStatus());
        isUpdate = true;
      }

      if (light.getStatus() != fm.getDeviceStatus<bool>(light.getName())) {
        fm.setDeviceStatus(light.getName(), light.getStatus());
        isUpdate = true;
      }

      if (door.getStatus() != fm.getDeviceStatus<bool>(door.getName())) {
        fm.setDeviceStatus(door.getName(), door.getStatus());
        isUpdate = true;
      }

      if (currentMillis - lastUpdateStatusTime >= updateInterval && isUpdate) {
        logger.device(fm.getNameUpdateStatus());
        logger.status("Updating status...");
        lastUpdateStatusTime = currentMillis;
        isUpdateDone = false;
        fm.updateDevicesStatus();
        // delay(1000);
      }
    }

    // Get devices status
    if (currentMillis - lastGetStatusTime >= updateInterval && isGetDone) {
      lastGetStatusTime = currentMillis;
      isGetDone = false;
      fm.getDevicesStatus();
      // delay(1000);
    }

    if (currentMillis - lastGetAutoTime >= updateInterval / 2 && isGetAutoDone) {
      lastGetAutoTime = currentMillis;
      isGetAutoDone = false;
      fm.getDevicesAuto();
      // delay(1000);
    }

    if (currentMillis - lastUpdateEnvTime >= updateInterval / 2 && isUpdateEnvDone) {
      logger.device(fm.getNameUpdateEnvironment());
      logger.status("Updating environment...");
      lastUpdateEnvTime = currentMillis;
      isUpdateEnvDone = false;
      fm.updateEnvironment();
      // delay(1000);
    }
  } else {
    logger.status("Not ready");
    delay(200);
  }
}

void asyncCB(AsyncResult &aResult) {
  printResult(aResult);
}

void printResult(AsyncResult &aResult) {
  if (aResult.isEvent()) {
    Firebase.printf("Event task: %s, msg: %s, code: %d\n", aResult.uid().c_str(), aResult.appEvent().message().c_str(), aResult.appEvent().code());
  }

  if (aResult.isDebug()) {
    Firebase.printf("Debug task: %s, msg: %s\n", aResult.uid().c_str(), aResult.debug().c_str());
  }

  if (aResult.isError()) {
    Firebase.printf("Error task: %s, msg: %s, code: %d\n", aResult.uid().c_str(), aResult.error().message().c_str(), aResult.error().code());
  }

  if (aResult.available()) {
    // Firebase.printf("task: %s, payload: %s\n", aResult.uid().c_str(), aResult.c_str());
  }

  if (aResult.uid().equals(fm.getNameGetStatus())) {
    logger.device(fm.getNameGetStatus());
    logger.status("Get successfully", false);
    String payload = aResult.c_str();
    logger.value(payload);

    if (payload.indexOf("null") != -1) {
      logger.error("Payload is null");
      return;
    }

    fm.parseDevicesStatus(payload);
    if (fm.isErrorParsingStatus()) {
      logger.error("Failed to parse status");
      return;
    } else {
      logger.status("Parsed successfully");
    }

    refillFood.setStatus(fm.getDeviceStatus<bool>(refillFood.getName()));
    refillWater.setStatus(fm.getDeviceStatus<bool>(refillWater.getName()));
    laser.setStatus(fm.getDeviceStatus<bool>(laser.getName()));
    fan.setStatus(fm.getDeviceStatus<bool>(fan.getName()));
    door.setStatus(fm.getDeviceStatus<bool>(door.getName()));
    light.setStatus(fm.getDeviceStatus<bool>(light.getName()));

    isGetDone = true;
  }

  else if (aResult.uid().equals(fm.getNameGetAuto())) {
    logger.device(fm.getNameGetAuto());
    logger.status("Get auto successfully", false);
    String payload = aResult.c_str();
    logger.value(payload);

    if (payload.indexOf("null") != -1) {
      logger.error("Payload is null");
      return;
    }

    fm.parseDevicesAuto(payload);
    if (fm.isErrorParsingAuto()) {
      logger.error("Failed to parse auto");
      return;
    } else {
      logger.status("Parsed auto successfully");
    }

    isGetAutoDone = true;
  }

  else if (aResult.uid().equals(fm.getNameUpdateStatus())) {
    logger.device(fm.getNameUpdateStatus());
    logger.status("Updated successfully");
    isUpdateDone = true;
  }

  else if (aResult.uid().equals(fm.getNameUpdateEnvironment())) {
    logger.device(fm.getNameUpdateEnvironment());
    logger.status("Updated env successfully");
    isUpdateEnvDone = true;
  }

  else if (aResult.uid().equals(fm.getNameCreateDocHealth())) {
    logger.device(fm.getNameCreateDocHealth());
    logger.status("Update food and drink successfully");
  }

  else if (aResult.uid().equals(fm.getNameCreateDocEnv())) {
    logger.device(fm.getNameCreateDocEnv());
    logger.status("Update environment successfully");
  }
}
