#ifndef LOGGER_H
#define LOGGER_H

#include <Arduino.h>

class Logger {
private:
  void nextLine(bool endline = false);

public:
  void device(const String &device, bool child = false, bool nextline = false);
  void deviceControl(const String &controller, const String &target, bool nextline = false);

  template <typename T>
  void value(const T &value, bool nextline = false) {
    Serial.print("[VL]: ");
    Serial.print(value);
    nextLine(nextline);
  }

  void status(const String &status, bool nextline = true);
  void error(const String &error, bool nextline = true);

  void firebaseAllow(bool nextline = false);
  void firebaseDeny(bool nextline = false);

  void endline();
  void beginLoop();
};

#endif
