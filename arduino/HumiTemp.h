#ifndef HUMI_TEMP_H
#define HUMI_TEMP_H

#include "DHT.h"
#include <Arduino.h>

class HumiTemp {
private:
  uint8_t pin;
  float h;
  float t;
  DHT dht;

public:
  HumiTemp(const uint8_t &pin);
  ~HumiTemp() = default;
  void init();
  bool isReady() const;
  void readHumidity();
  void readTemperature();
  float getHumidity() const;
  float getTemperature() const;
  bool isHot() const;
  String getName() const;
  String getNameHumidity() const;
  String getNameTemperature() const;
};

#endif
