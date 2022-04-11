import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistsPage } from './artists.page';

describe('AuthorsPage', () => {
  let component: ArtistsPage;
  let fixture: ComponentFixture<ArtistsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArtistsPage],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
