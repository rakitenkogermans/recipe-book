import { Component, OnInit } from '@angular/core';
import {Recipe} from './recipe.model';
import {DataStorageService} from '../shared/data-storage.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent implements OnInit {
  recipeSelected: Recipe;

  constructor(private storageService: DataStorageService) { }

  ngOnInit() {
    this.storageService.fetchRecipes().subscribe();
  }

}
