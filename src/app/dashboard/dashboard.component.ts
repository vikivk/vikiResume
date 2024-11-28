import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { DashboardService } from './dashboard.service';
import { HttpClientModule } from '@angular/common/http';

interface Stock {
  productId: number;
  productName: string;
  productType: string;
  stock: number;

}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HttpClientModule],
  providers: [DashboardService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @Input() stocks: Stock[] = []; 
  @ViewChild('barCanvas') private barCanvas!: ElementRef;
  @ViewChild('lineCanvas') private lineCanvas!: ElementRef; 
  private barChart: Chart | undefined;
  private lineChart: Chart | undefined;

  constructor(private DashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadAccountMaster();
  }

  loadAccountMaster() {
    this.DashboardService.stockDisplay().subscribe({
      next: (data: Stock[]) => {
        this.stocks = data;
        console.log('Stocks loaded', data);
        this.initializeCharts(); // Initialize both charts once data is loaded
      },
      error: (error) => {
        console.error('Failed to load stocks', error);
      }
    });
  }
  
  initializeCharts(): void {
    // Destroy existing charts if any
    if (this.barChart) {
      this.barChart.destroy();
    }
    if (this.lineChart) {
      this.lineChart.destroy();
    }

    // Prepare chart data
    const labels = this.stocks.map(stock => stock.productName);
    const data = this.stocks.map(stock => stock.stock);

    // Initialize Bar Chart
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Stock Quantity (Bar Chart)',
            data: data,
            backgroundColor: 'rgba(26, 118, 210, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Product Name' // X-axis label for Bar Chart
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Stock Quantity' // Y-axis label for Bar Chart
            }
          }
        }
      }
    });

    // Initialize Line Chart
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Stock Quantity (Line Chart)',
            data: data,
            fill: false,  // Set to true if you want the area under the line to be filled
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Product Name' // X-axis label for Line Chart
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Stock Quantity' // Y-axis label for Line Chart
            }
          }
        }
      }
    });
    
  }
  
}
