import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import { CalculateInput } from '../../models/calculate-input.model';
import { Forecast } from '../../models/forecast.model';
import { Milestones } from './milestone.model';

@Component({
  selector: 'app-milestones',
  templateUrl: './milestones.component.html',
  styleUrls: ['./milestones.component.css']
})
export class MilestonesComponent implements OnInit, OnChanges {

  @Input() calculateInput: CalculateInput;
  @Input() forecast: Forecast;
  milestones: Milestones;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.calculateInput && changes.calculateInput.currentValue) {
      this.calculate();
    }
  }

  calculate() {
    const fiNumber = 1 / this.calculateInput.annualSafeWithdrawalRate * this.calculateInput.annualExpenses;
    let leanFiNumber = fiNumber * this.calculateInput.leanFiPercentage;
    if (this.calculateInput.leanAnnualExpenses) {
      leanFiNumber = 1 / this.calculateInput.annualSafeWithdrawalRate * this.calculateInput.leanAnnualExpenses;
    }
    const eclipseForecast = this.forecast.monthlyForecasts.find(m => {
      return m.totalContributions <= m.totalReturns;
    });
    if (!eclipseForecast) {
      this.milestones = new Milestones(fiNumber, leanFiNumber, 0);
      return;
    }

    const eclipseMarker = Math.min(eclipseForecast.totalContributions, eclipseForecast.totalReturns);
    this.milestones = new Milestones(fiNumber, leanFiNumber, eclipseMarker * 2);
  }
}
