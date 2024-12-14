#ifndef REFILL_FOOD_H
#define REFILL_FOOD_H

#include "HX711.h"
#include <Arduino.h>
#include <ESP32Servo.h>

class RefillFood {
private:
  uint16_t turnTime;
  bool status;
  Servo servo;

  uint8_t dt;
  uint8_t sck;
  float weight;
  float sumG;
  HX711 loadcell;

  void calibrate();

public:
  RefillFood(const uint8_t &servoPin,
             const uint16_t &turnTime,
             const uint8_t &dt,
             const uint8_t &sck);
  ~RefillFood() = default;

  void init();
  bool isReady();
  void readWeight();
  float getWeight() const;
  bool isLow() const;
  void on();
  void off();
  void sum(const float &value);
  float getSum() const;
  void resetSum();
  bool getStatus() const;
  void setStatus(const bool &status);

  String getName() const;
  String getNameFood() const;
};

#endif
