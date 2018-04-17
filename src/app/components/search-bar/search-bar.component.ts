import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { KittyService } from '../../services/kitty.service';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { ISearchSuggestion } from '../../models/search-suggestion';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  seachInputControl: FormControl;
  sortColumnControl: FormControl;
  sortDirectionControl: FormControl;

  sortDirection = false;
  sortColumns = [
    { title: 'ID', column: 'ID' },
    { title: 'Generation', column: 'Generation' },
    { title: 'Children', column: 'ChildrenCount' },
  ];
  sortColumn = null;
  suggestions: string[] = [];

  filteredStates: Observable<ISearchSuggestion[]>;

  private _searchInput = '';
  get searchInput() {
    return this._searchInput;
  }
  set searchInput(value) {
    this._searchInput = value;
  }

  constructor(private _router: Router, private _route: ActivatedRoute, private _kittyService: KittyService) {
    this.seachInputControl = new FormControl();
    this.sortColumnControl = new FormControl();
    this.sortDirectionControl = new FormControl();
    this.sortColumn = this.sortColumns[0];
    this._kittyService.getSuggestions().subscribe(res => {
      this.suggestions = res;
    });
    this.filteredStates = this.seachInputControl.valueChanges.
      map(text => text ? this.filterSuggestions(text) : []);
  }

  filterSuggestions(text: string) {
    const regex = /\b(\w+)$/i;
    let res: ISearchSuggestion[] = [];
    const matches = text.match(regex);
    if (matches && matches.length) {
      const lastWord = matches.pop().toLowerCase();
      const filtered = this.suggestions.filter(s => s.startsWith(lastWord) && (s.toLowerCase() !== lastWord));
      res = filtered.map(s => {
        return {
          title: s,
          value: text.replace(regex, s),
        };
      });
    }
    return res;
  }

  ngOnInit() {
    this._route.queryParamMap.subscribe(params => {
      const searchValue = params.get('search');
      if (searchValue) {
        this.seachInputControl.setValue(searchValue);
      }
      const sort = params.get('sort');
      if (sort) {
        const sortColumnName = sort.replace(/\sdesc/ig, '');
        this.sortColumn = this.sortColumns.find(c => c.column === sortColumnName);
        this.sortDirection = !sort.toLowerCase().endsWith(' desc');
      }
      if (!this.sortColumn) {
        // default sort
        this.sortColumn = this.sortColumns[0];
        this.sortDirection = false;
      }
      this.sortColumnControl.setValue(this.sortColumn.column);
      this.sortDirectionControl.setValue(this.sortDirection ? 'ascending' : 'descending');
    });
  }

  updateRouteQuery() {
    this._router.navigate(
      ['/kitties/all'],
      {
        queryParams: {
          search: this.seachInputControl.value.trim(),
          sort: this.sortColumn ? `${this.sortColumn.column}${!this.sortDirection ? ' DESC' : ''}` : ''
        }
      });
  }

  onSearch(e) {
    if (((e instanceof KeyboardEvent) && (e.keyCode === 13)) || (e instanceof MouseEvent)) {
      this.updateRouteQuery();
      e.preventDefault();
    }
  }

  onSortDirection(e) {
    const asc = e.value === 'ascending';
    if (this.sortDirection !== asc) {
      this.sortDirection = asc;
      this.updateRouteQuery();
    }
    e.preventDefault();
  }

  onSortColumn(e) {
    const column = this.sortColumns.find( c => c.column === e.value);
    if (this.sortColumn !== column) {
      this.sortColumn = column;
      this.updateRouteQuery();
    }
  }
}
