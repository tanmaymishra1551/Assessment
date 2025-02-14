import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, startWith, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SuccessModalComponent } from '../success-modal/success-modal.component';
import { environment } from 'src/environments/environment.prod'; 

@Component({
  selector: 'app-grn-stepper',
  templateUrl: './create-grn.component.html',
  styleUrls: ['./create-grn.component.css'],
})
export class GrnStepperComponent implements OnInit {
  isEditable = true;
  grnForm: FormGroup;
  detailsFormGroup: FormGroup;
  inventoriesFormGroup: FormGroup;

  companies = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Google' },
    { id: 3, name: 'Microsoft' },
    { id: 4, name: 'Amazon' }
  ]; // Static Data

  stores: { name: string }[] = [
    { name: 'Grow Room' },
    { name: 'Waste Store' },
    { name: 'Retail Store' },
    { name: 'Warehouse' }
  ];

  itemCategories: { name: string }[] = [
    { name: 'Grow Room' },
    { name: 'Waste Store' },
    { name: 'Drying Room' },
    { name: 'Processing Unit' }
  ];

  availableItems =[
  { name: "Seeds & Seedlings", uom: ["Packets"] },
  { name: "Grow Lights & Fixtures", uom: ["Sets"] },
  { name: "Nutrients & Fertilizers", uom: ["Liters"] },
  { name: "Irrigation Equipment", uom: ["Units"] },
  { name: "Climate Control Systems", uom: ["Sets"] },
  { name: "Pest Control Supplies", uom: ["Packs"] }];

  // Search controls for details step (keep these as needed)
  companySearchControl = this.fb.control('', Validators.required);
  storeSearchControl = this.fb.control('', Validators.required);

  // Filtered Observables for search (for details step)
  filteredCompanies!: Observable<any[]>;
  filteredStores!: Observable<{ name: string }[]>;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog
  ) {
    // Step 1: Details
    this.detailsFormGroup = this.fb.group({
      company: ['', Validators.required],
      date: ['', Validators.required],
      store: ['', Validators.required],
      remarks: [''],
      documentNumber: [{ value: 'XXX-XXX-XXXX', disabled: true }],
    });

    // Step 2: Inventories
    this.inventoriesFormGroup = this.fb.group({
      items: this.fb.array([]),
    });

    // Parent Form
    this.grnForm = this.fb.group({
      details: this.detailsFormGroup,
      inventories: this.inventoriesFormGroup,
    });
  }

  ngOnInit(): void {
    // Filter for company search field (for details step)
    this.filteredCompanies = this.companySearchControl.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? this._filterCompanies(value) : this.companies))
    );

    // Filter for store search field (for details step)
    this.filteredStores = this.storeSearchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterStores(value || ''))
    );
  }

  private _filterCompanies(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.companies.filter(company => company.name.toLowerCase().includes(filterValue));
  }

  private _filterStores(value: string): { name: string }[] {
    const filterValue = value.toLowerCase();
    return this.stores.filter(store => store.name.toLowerCase().includes(filterValue));
  }

  filterCategories(value: string): { name: string }[] {
    const filterValue = value.toLowerCase();
    return this.itemCategories.filter(category => category.name.toLowerCase().includes(filterValue));
  }

  filter(value: string, array: any[]): string[] {
    const filterValue = value.toLowerCase();
    return array
      .map(item => item.name) // Extract item names
      .filter(name => name.toLowerCase().includes(filterValue));
  }
  

  displayCompany(company: any): string {
    return company && company.name ? company.name : '';
  }

  selectCompany(event: any) {
    const selectedCompany = event.option.value;
    this.detailsFormGroup.get('company')?.setValue(selectedCompany);
    this.companySearchControl.setValue(selectedCompany);
  }

  selectStore(event: any) {
    const selectedStore = event.option.value;
    this.detailsFormGroup.get('store')?.setValue(selectedStore);
    this.storeSearchControl.setValue(selectedStore);
  }

  // Note: For the item autocomplete, we now pass the item index.
  selectItemCategory(event: any, index: number) {
    const selectedCategory = event.option.value;
    (this.items.at(index) as FormGroup).get('itemCategory')?.setValue(selectedCategory);
  }

  selectItem(event: any, index: number) {
    const selectedItemName = event.option.value;
    const selectedItem = this.availableItems.find(item => item.name === selectedItemName);
  
    if (selectedItem) {
      (this.items.at(index) as FormGroup).patchValue({
        item: selectedItemName,
        uom: selectedItem.uom.join(", ") // Join multiple UOMs as a string
      });
    }
  }

  get items(): FormArray {
    return this.inventoriesFormGroup.get('items') as FormArray;
  }

  addItem() {
    const itemGroup = this.fb.group({
      itemCategory: ['', Validators.required],
      item: ['', Validators.required],
      quantity: [0, Validators.required],
      uom: ['kg', Validators.required],
      totalCost: [0, Validators.required],
      costPerUnit: [{ value: 0, disabled: true }, Validators.required],
    });

    // Calculate costPerUnit whenever quantity or totalCost changes
    itemGroup.valueChanges.subscribe(value => {
      const quantity = value.quantity || 0;
      const totalCost = value.totalCost || 0;
      const costPerUnit = quantity > 0 ? totalCost / quantity : 0;
      itemGroup.get('costPerUnit')?.setValue(costPerUnit, { emitEvent: false });
    });

    this.items.push(itemGroup);
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  onSubmit() {
    if (this.grnForm.valid) {
      
      const formData = this.grnForm.value;
      console.log('Form Data:', formData);

      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const url = `${environment.apiUrl}/api/v1/form/check`; 
      this.http.post(url, formData, { headers }).subscribe(
        response => {
          console.log('Server Response:', response)
          this.openSuccessModal();
        },
        error => console.error('Error:', error)
      );
    } else {
      console.log('Form is invalid');
    }
  }
  openSuccessModal(): void {
    this.dialog.open(SuccessModalComponent, {
      width: '400px'
    });
  }

}
