import { TestBed } from '@angular/core/testing';
import { FirebaseService } from "./firebase.service";

describe("FirebaseService", () => {
  let service: FirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseService);
  });

  describe('method1', () => {
    it('should ...', () => {
      expect(service).toBeTruthy();
    });
  });
});
