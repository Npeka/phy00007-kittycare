#include "Fan.h"

Fan::Fan(const uint8_t &pin) : pin(pin), status(false) {}

void Fan::init() {
  pinMode(pin, OUTPUT);
}

void Fan::on() {
  digitalWrite(pin, HIGH);
  status = true;
}

void Fan::off() {
  digitalWrite(pin, LOW);
  status = false;
}

bool Fan::getStatus() const {
  return status;
}

void Fan::setStatus(const bool &status) {
  this->status = status;
}

String Fan::getName() const {
  return "fan";
}
