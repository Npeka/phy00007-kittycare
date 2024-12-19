#ifndef FAN_H
#define FAN_H

#include <Arduino.h>

class Fan {
private:
  uint8_t pin;
  bool status;

public:
  Fan(const uint8_t &pin);
  ~Fan() = default;
  void init();
  void on();
  void off();
  bool getStatus() const;
  void setStatus(const bool &status);
  String getName() const;
};

#endif
