#ifndef LIGHT_H
#define LIGHT_H

#include <Arduino.h>

class Light {
private:
  uint8_t ledPin;
  uint8_t ldrPin;
  int light;
  bool status;

public:
  Light(const uint8_t &ledPin, const uint8_t &ldrPin);
  ~Light() = default;
  void init();
  void readLight();
  int getLight() const;
  bool isLight() const;
  void on();
  void off();
  bool getStatus() const;
  void setStatus(const bool &status);
  String getName() const;
};

#endif
