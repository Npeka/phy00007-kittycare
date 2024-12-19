#include "Protect.h"

Protect::Protect(
    const uint8_t &trigPin,
    const uint8_t &echoPin,
    const uint8_t &ledPin,
    const uint8_t &buzzerPin) : trigPin(trigPin),
                                echoPin(echoPin),
                                ledPin(ledPin),
                                buzzerPin(buzzerPin),
                                distance(0),
                                status(false) {}

void Protect::init() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(ledPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);

  digitalWrite(ledPin, LOW);
  digitalWrite(buzzerPin, LOW);
}

void Protect::readDistanceCM() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  distance = pulseIn(echoPin, HIGH) * 0.034 / 2;
}

bool Protect::isFar() const {
  return distance > 2;
}

void Protect::on() {
  digitalWrite(ledPin, HIGH);
  // tone(buzzerPin, 50);
  status = true;
}

void Protect::off() {
  digitalWrite(ledPin, LOW);
  // tone(buzzerPin, 0);
  status = false;
}

int Protect::getDistance() const {
  return distance;
}

bool Protect::getStatus() const {
  return status;
}

String Protect::getName() const {
  return "protect";
}
