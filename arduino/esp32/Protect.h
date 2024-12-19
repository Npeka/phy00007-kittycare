#ifndef PROTECT_H
#define PROTECT_H

#include <Arduino.h>

class Protect {
private:
  uint8_t trigPin;
  uint8_t echoPin;
  uint8_t ledPin;
  uint8_t buzzerPin;
  float distance;
  bool status;

public:
  Protect(const uint8_t &trigPin,
          const uint8_t &echoPin,
          const uint8_t &ledPin,
          const uint8_t &buzzerPin);
  ~Protect() = default;
  void init();
  void readDistanceCM();
  bool isFar() const;
  void on();
  void off();
  int getDistance() const;
  bool getStatus() const;
  String getName() const;
};

#endif
