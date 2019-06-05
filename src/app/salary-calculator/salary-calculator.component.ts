import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-salary-calculator',
  templateUrl: './salary-calculator.component.html',
  styleUrls: ['./salary-calculator.component.css']
})
export class SalaryCalculatorComponent implements OnInit {

  // INSS and IRPF Information

  MAX_INSS_VALUE = 621.04;

  inssTable = [
    {
      up: 1693.72,
      tax: 8
    },
    {
      up: 2822.9,
      tax: 9
    },
    {
      up: 5645.8,
      tax: 11
    }
  ];

  irpfTable = [
    {
      up: 1903.98,
      tax: 0,
      deduction: 0
    },
    {
      up: 2826.65,
      tax: 7.5,
      deduction: 142.8
    },
    {
      up: 3751.05,
      tax: 15.0,
      deduction: 354.8
    },
    {
      up: 4664.68,
      tax: 22.5,
      deduction: 636.13
    },
    {
      up: Number.MAX_SAFE_INTEGER,
      tax: 27.5,
      deduction: 869.36
    },
  ];

  // Form Control
  salary = new FormControl('');

  // Variables
  grossSalary: number;
  baseINSS: number;
  inssDeduction: number;
  baseIRPF: number;
  irpfDeduction: number;

  ngOnInit() {

  }

  async calculateGrossSalary() {
    this.clearValues();
    await this.calculateIRPF(this.salary.value);
    await this.calculateINSSAndGrossSalary(this.baseIRPF);
  }

  calculateINSSAndGrossSalary(salary: number) {
    for (const item of this.inssTable) {
      this.calculateINSSBase(salary, item.tax);
      if ((this.getINSSTax(this.baseINSS) === -1) ) {
        this.inssDeduction = this.MAX_INSS_VALUE;
        this.baseINSS = this.inssDeduction + this.baseIRPF ;
        this.grossSalary =  this.baseINSS;
        break;
      } else if (this.getINSSTax(this.baseINSS) === item.tax) {
        this.inssDeduction =  this.baseINSS - this.baseIRPF;
        this.grossSalary =  this.baseINSS;
        break;
      }
    }

  }

  calculateIRPF(netSalary: number) {
    for (const item of this.irpfTable) {
      this.calculateIRPFBase(netSalary, item.deduction, item.tax);
      if ((this.getIRPFTax(this.baseIRPF) === item.tax) && (this.getIRPFDeduction(this.baseIRPF) === item.deduction)) {
        this.irpfDeduction =  this.baseIRPF - netSalary;
        break;
      }
    }
  }

  getIRPFTax(salary: number) {
    if (salary < 1903.98) {
      return 0;
    } else if ((salary >= 1903.98) && (salary < 2826.65)) {
      return 7.5;
    } else if ((salary >= 2826.65) && (salary < 3751.05)) {
      return 15.0;
    } else if ((salary >= 3751.05) && (salary < 4664.68)) {
      return 22.5;
    } else {
      return 27.5;
    }
  }

  getIRPFDeduction(salary: number) {
    if (salary < 1903.98) {
      return 0;
    } else if ((salary >= 1903.98) && (salary < 2826.65)) {
      return 142.8;
    } else if ((salary >= 2826.65) && (salary < 3751.05)) {
      return 354.8;
    } else if ((salary >= 3751.05) && (salary < 4664.68)) {
      return 636.13;
    } else {
      return 869.36;
    }
  }

  getINSSTax(salary: number) {
    if (salary < 1693.72) {
      return 8;
    } else if ((salary >= 1693.72) && (salary < 2822.9)) {
      return 9;
    } else if ((salary >= 2822.9) && (salary < 5645.8)) {
      return 11;
    } else {
      return -1;
    }
  }

  clearValues() {
    this.grossSalary = 0;
    this.baseINSS = 0;
    this.inssDeduction = 0;
    this.baseIRPF = 0;
    this.irpfDeduction = 0;
  }

  calculateIRPFBase(netSalary: number, deduction: number, tax: number) {
    this.baseIRPF = 0;
    this.baseIRPF = (netSalary - deduction) / (1 - (tax / 100));
  }

  calculateINSSBase(salary: number, tax: number) {
    this.baseINSS = 0;
    this.baseINSS = (salary) / (1 - (tax / 100));
  }

}
