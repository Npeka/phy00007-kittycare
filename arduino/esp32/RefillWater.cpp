#include "RefillWater.h"

RefillWater::RefillWater(
    const uint8_t &relayPin,
    const uint8_t &sensorPin,
    const uint8_t &powerPin,
    const uint16_t &volumeThreshold) : relayPin(relayPin),
                                       sensorPin(sensorPin),
                                       powerPin(powerPin),
                                       volumeThreshold(volumeThreshold),
                                       volume(0),
                                       sumMl(0),
                                       status(false) {}

void RefillWater::init() {
  pinMode(relayPin, OUTPUT);
  pinMode(sensorPin, INPUT);
  pinMode(powerPin, OUTPUT);
  digitalWrite(relayPin, LOW);
}

void RefillWater::readVolume() {
  digitalWrite(powerPin, HIGH);
  delay(2000);
  uint16_t currentVolume = analogRead(sensorPin);
  volume = map(currentVolume, 0, 1250, 0, volumeThreshold);
  digitalWrite(powerPin, LOW);
}

float RefillWater::getVolume() const {
  return volume;
}

void RefillWater::sum(const uint16_t &ml) {
  sumMl += ml;
}

float RefillWater::getSum() const {
  return sumMl;
}

void RefillWater::resetSum() {
  sumMl = 0;
}

void RefillWater::on() {
  digitalWrite(relayPin, LOW);
  status = true;
}

void RefillWater::off() {
  digitalWrite(relayPin, HIGH);
  status = false;
}

bool RefillWater::getStatus() const {
  return status;
}

void RefillWater::setStatus(const bool &status) {
  this->status = status;
}

String RefillWater::getName() const {
  return "refill_water";
}

String RefillWater::getNameDrink() const {
  return "drink";
}
