import { Component } from '@angular/core';
import { StockService } from './stock.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule],
  providers:[StockService],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})
export class StockComponent {

stocks:any[] = [];
  constructor(private StockService: StockService) { }

  ngOnInit(): void {
    this.loadAccountMaster();
  }

  loadAccountMaster() {
    this.StockService.stockDisplay().subscribe({
      next: (data: any) => {
        this.stocks = data;
        // console.log(this.accountMaster)
        console.log('AccounMaster loaded', data);
      },
      error: (error) => {
        console.error('Failed to load account', error);
      }
    });
  }
}
