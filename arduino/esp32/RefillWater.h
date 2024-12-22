#ifndef REFILL_WATER_H
#define REFILL_WATER_H

#include <Arduino.h>

class RefillWater {
private:
  uint8_t relayPin;
  uint8_t sensorPin;
  uint8_t powerPin;
  uint16_t volumeThreshold;
  uint16_t volume;
  uint16_t sumMl;
  bool status;

public:
  RefillWater(const uint8_t &relayPin,
              const uint8_t &sensorPin,
              const uint8_t &powerPin,
              const uint16_t &volumeThreshold);
  ~RefillWater() = default;

  void init();
  void readVolume();
  float getVolume() const;
  void sum(const uint16_t &ml);
  float getSum() const;
  void resetSum();
  void on();
  void off();
  bool getStatus() const;
  void setStatus(const bool &status);
  String getName() const;
  String getNameDrink() const;
};

#endif
