#include "Light.h"

Light::Light(const uint8_t &ledPin, const uint8_t &ldrPin) : ledPin(ledPin), ldrPin(ldrPin), light(0) {}

void Light::init() {
  pinMode(this->ledPin, OUTPUT);
  pinMode(this->ldrPin, INPUT);
}

void Light::readLight() {
  this->light = analogRead(ldrPin);
}

int Light::getLight() const {
  return this->light;
}

bool Light::isLight() const {
  return this->light < 1000 && this->light != 4095;
}

void Light::on() {
  digitalWrite(this->ledPin, HIGH);
  status = true;
}

void Light::off() {
  digitalWrite(this->ledPin, LOW);
  status = false;
}

bool Light::getStatus() const {
  return this->status;
}

void Light::setStatus(const bool &status) {
  this->status = status;
}

String Light::getName() const {
  return "light";
}
