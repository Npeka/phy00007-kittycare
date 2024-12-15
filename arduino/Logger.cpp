#include "Logger.h"

void Logger::nextLine(bool endline) {
  Serial.print(endline ? "\n" : " - ");
}

void Logger::device(const String &device, bool child, bool nextline) {
  char buffer[64]; // Tạo buffer để gom log
  snprintf(buffer, sizeof(buffer), "%s[DV]: %s", child ? "    " : "", device.c_str());
  Serial.print(buffer);
  nextLine(nextline);
}

void Logger::deviceControl(const String &controller, const String &target, bool nextline) {
  char buffer[64];
  snprintf(buffer, sizeof(buffer), "[DC]: %s/%s", controller.c_str(), target.c_str());
  Serial.print(buffer);
  nextLine(nextline);
}

void Logger::status(const String &status, bool nextline) {
  char buffer[64];
  snprintf(buffer, sizeof(buffer), "[ST]: %s", status.c_str());
  Serial.print(buffer);
  nextLine(nextline);
}

void Logger::error(const String &error, bool nextline) {
  char buffer[64];
  snprintf(buffer, sizeof(buffer), "[ER]: %s", error.c_str());
  Serial.print(buffer);
  nextLine(nextline);
}

void Logger::firebaseAllow(bool nextline) {
  Serial.print("[FB]: allow");
  nextLine(nextline);
}

void Logger::firebaseDeny(bool nextline) {
  Serial.print("[FB]: deny");
  nextLine(nextline);
}

void Logger::endline() {
  Serial.println();
}

void Logger::beginLoop() {
  Serial.println("\n----------------begin-loop---------------");
}
