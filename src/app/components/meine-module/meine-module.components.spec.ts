import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeineModuleComponents } from './meine-module.components';

describe('MeineModulePage', () => {
  let component: MeineModuleComponents;
  let fixture: ComponentFixture<MeineModuleComponents>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MeineModuleComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
