import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  @Output() recipeWasSelected = new EventEmitter<Recipe>();
  recipes: Recipe[] = [
    new Recipe('test name', 'test description', 'https://www.maxpixel.net/static/photo/1x/Cooking-Meat-Recipe-Dinner-Restaurant-Grill-Beef-2508859.jpg'),
    new Recipe('another test name', 'test description', 'https://www.maxpixel.net/static/photo/1x/Cooking-Meat-Recipe-Dinner-Restaurant-Grill-Beef-2508859.jpg'),
  ];

  constructor() { }

  ngOnInit() {
  }

  onRecipeSelected(recipe: Recipe) {
    this.recipeWasSelected.emit(recipe);
  }
}
