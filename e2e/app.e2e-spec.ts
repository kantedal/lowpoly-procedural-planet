import { ProduceralPlanetPage } from './app.po';

describe('produceral-planet App', function() {
  let page: ProduceralPlanetPage;

  beforeEach(() => {
    page = new ProduceralPlanetPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
