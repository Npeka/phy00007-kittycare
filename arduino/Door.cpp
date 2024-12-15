#include "Door.h"

Door::Door(const uint8_t &pin, const uint16_t &turnTime) : turnTime(turnTime),
                                                           status(false),
                                                           lastStatus(false) {
  ESP32PWM::allocateTimer(0);
  ESP32PWM::allocateTimer(1);
  ESP32PWM::allocateTimer(2);
  ESP32PWM::allocateTimer(3);
  servo.setPeriodHertz(50);
  servo.attach(pin, 1000, 2000);
}

void Door::init() {
  servo.write(90);
  status = false;
}

void Door::open() {
  servo.write(0);
  delay(turnTime);
  servo.write(90);
  status = true;
  lastStatus = true;
}

void Door::close() {
  servo.write(180);
  delay(turnTime);
  servo.write(90);
  status = false;
  lastStatus = false;
}

bool Door::getStatus() const {
  return status;
}

bool Door::getLastStatus() const {
  return lastStatus;
}

void Door::setStatus(const bool &status) {
  this->status = status;
}

String Door::getName() const {
  return "door";
}
