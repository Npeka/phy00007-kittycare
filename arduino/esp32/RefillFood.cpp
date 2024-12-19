#include "RefillFood.h"

RefillFood::RefillFood(const uint8_t &servoPin,
                       const uint16_t &turnTime,
                       const uint8_t &dt,
                       const uint8_t &sck) : turnTime(turnTime),
                                             status(false),
                                             dt(dt), sck(sck),
                                             loadcell(),
                                             weight(0) {
  ESP32PWM::allocateTimer(0);
  ESP32PWM::allocateTimer(1);
  ESP32PWM::allocateTimer(2);
  ESP32PWM::allocateTimer(3);
  servo.setPeriodHertz(50);
  servo.attach(servoPin, 1000, 2000);
}

void RefillFood::calibrate() {
}

void RefillFood::init() {
  servo.write(90);
  loadcell.begin(dt, sck);
  loadcell.set_scale();
  loadcell.tare();
  loadcell.read_average();
}

bool RefillFood::isReady() {
  return loadcell.is_ready();
}

void RefillFood::readWeight() {
  loadcell.set_scale(-103525);
  float w = loadcell.get_units() * 1000;
  if (w < 0) {
    w = 0;
  }
  weight = w;
}

float RefillFood::getWeight() const {
  return weight;
}

bool RefillFood::isLow() const {
  return weight < 100;
}

void RefillFood::on() {
  servo.write(0);
  delay(turnTime);
  servo.write(90);
  status = true;
}

void RefillFood::off() {
  servo.write(180);
  delay(turnTime);
  servo.write(90);
  status = false;
}

void RefillFood::sum(const float &value) {
  sumG += value;
}

float RefillFood::getSum() const {
  return sumG;
}

void RefillFood::resetSum() {
  sumG = 0;
}

void RefillFood::setStatus(const bool &status) {
  this->status = status;
}

bool RefillFood::getStatus() const {
  return status;
}

String RefillFood::getName() const {
  return "refill_food";
}

String RefillFood::getNameFood() const {
  return "food";
}
