#include "Laser.h"

Laser::Laser(const uint8_t &pin) : pin(pin),
                                   status(false) {}

void Laser::init() {
  pinMode(this->pin, OUTPUT);
}

void Laser::on() {
  digitalWrite(this->pin, HIGH);
  this->status = true;
}

void Laser::off() {
  digitalWrite(this->pin, LOW);
  this->status = false;
}

bool Laser::getStatus() const {
  return this->status;
}

void Laser::setStatus(const bool &status) {
  this->status = status;
}

String Laser::getName() const {
  return "laser";
}