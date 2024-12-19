#include "HumiTemp.h"

#define DHT_TYPE DHT11

HumiTemp::HumiTemp(const uint8_t &pin) : pin(pin), h(0.0f), t(0.0f), dht(pin, DHT_TYPE) {}

void HumiTemp::init() {
  dht.begin();
}

bool HumiTemp::isReady() const {
  return !isnan(h) && !isnan(t);
}

void HumiTemp::readHumidity() {
  h = dht.readHumidity();
}

void HumiTemp::readTemperature() {
  t = dht.readTemperature();
}

float HumiTemp::getHumidity() const {
  return h;
}

float HumiTemp::getTemperature() const {
  return t;
}

bool HumiTemp::isHot() const {
  return t > 28.0f;
}

String HumiTemp::getName() const {
  return "dht";
}

String HumiTemp::getNameHumidity() const {
  return "humidity";
}

String HumiTemp::getNameTemperature() const {
  return "temperature";
}
