#ifndef DOOR_H
#define DOOR_H

#include <Arduino.h>
#include <ESP32Servo.h>

class Door {
private:
  Servo servo;
  uint16_t turnTime;
  bool status;
  bool lastStatus;

public:
  Door(const uint8_t &pin, const uint16_t &turnTime);
  ~Door() = default;
  void init();
  void open();
  void close();
  bool getStatus() const;
  bool getLastStatus() const;
  void setStatus(const bool &status);
  String getName() const;
};

#endif
