#ifndef LASER_H
#define LASER_H

#include <Arduino.h>

class Laser {
private:
  uint8_t pin;
  bool status;

public:
  Laser(const uint8_t &pin);
  ~Laser() = default;
  void init();
  void on();
  void off();
  String getName() const;
  bool getStatus() const;
  void setStatus(const bool &status);
};

#endif
