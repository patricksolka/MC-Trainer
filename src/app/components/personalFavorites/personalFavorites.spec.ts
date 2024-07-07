import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalFavorites } from './personalFavorites';

describe('MeineModulePage', () => {
  let component: PersonalFavorites;
  let fixture: ComponentFixture<PersonalFavorites>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalFavorites);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
