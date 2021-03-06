/*
 * Copyright 2017-2018 Allegro.pl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { $, Expression } from "plywood";
import { FilterClause } from "../../../common/models/filter-clause/filter-clause";
import { TimeShift } from "../../../common/models/time-shift/time-shift";
import { isCurrentDuration, isLatestDuration, isPreviousDuration } from "../../../common/utils/formatter/formatter";

export enum TimeFilterPeriod { LATEST = "latest", CURRENT = "current", PREVIOUS = "previous" }

const $MAX_TIME = $(FilterClause.MAX_TIME_REF_NAME);
const $NOW = $(FilterClause.NOW_REF_NAME);

export interface TimeFilterPreset {
  name: string;
  duration: string;
}

export function constructLatestFilter(duration: string): Expression {
  return $MAX_TIME.timeRange(duration, -1);
}

export function constructCurrentFilter(duration: string): Expression {
  return $NOW.timeFloor(duration).timeRange(duration, 1);
}

export function constructPreviousFilter(duration: string): Expression {
  return $NOW.timeFloor(duration).timeRange(duration, -1);
}

export const LATEST_PRESETS: TimeFilterPreset[] = [
  { name: "1H", duration: "PT1H" },
  { name: "6H", duration: "PT6H" },
  { name: "1D", duration: "P1D" },
  { name: "7D", duration: "P7D" },
  { name: "30D", duration: "P30D" }
];

export const CURRENT_PRESETS: TimeFilterPreset[] = [
  { name: "D", duration: "P1D" },
  { name: "W", duration: "P1W" },
  { name: "M", duration: "P1M" },
  { name: "Q", duration: "P3M" },
  { name: "Y", duration: "P1Y" }
];

export const PREVIOUS_PRESETS: TimeFilterPreset[] = [
  { name: "D", duration: "P1D" },
  { name: "W", duration: "P1W" },
  { name: "M", duration: "P1M" },
  { name: "Q", duration: "P3M" },
  { name: "Y", duration: "P1Y" }
];

export interface ShiftPreset {
  label: string;
  shift: TimeShift;
}

export const COMPARISON_PRESETS: ShiftPreset[] = [
  { label: "Off", shift: TimeShift.empty() },
  { label: "D", shift: TimeShift.fromJS("P1D") },
  { label: "W", shift: TimeShift.fromJS("P1W") },
  { label: "M", shift: TimeShift.fromJS("P1M") },
  { label: "Q", shift: TimeShift.fromJS("P3M") }
];

export function isShiftPreset(candidate: TimeShift): boolean {
  return COMPARISON_PRESETS.some(({ shift }) => shift.equals(candidate));
}

export function getFilterPeriod(clause: FilterClause): TimeFilterPeriod {
  const { relative, selection } = clause;

  if (isLatestDuration(relative, selection)) {
    return TimeFilterPeriod.LATEST;
  } else if (isPreviousDuration(relative, selection)) {
    return TimeFilterPeriod.PREVIOUS;
  } else if (isCurrentDuration(relative, selection)) {
    return TimeFilterPeriod.CURRENT;
  } else {
    return null;
  }
}

export function constructFilter(period: TimeFilterPeriod, duration: string): Expression {
  switch (period) {
    case TimeFilterPeriod.PREVIOUS:
      return constructPreviousFilter(duration);
    case TimeFilterPeriod.LATEST:
      return constructLatestFilter(duration);
    case TimeFilterPeriod.CURRENT:
      return constructCurrentFilter(duration);
    default:
      return null;
  }
}

export function getTimeFilterPresets(period: TimeFilterPeriod): TimeFilterPreset[] {
   switch (period) {
    case TimeFilterPeriod.PREVIOUS:
      return PREVIOUS_PRESETS;
    case TimeFilterPeriod.LATEST:
      return LATEST_PRESETS;
    case TimeFilterPeriod.CURRENT:
      return CURRENT_PRESETS;
  }
}
