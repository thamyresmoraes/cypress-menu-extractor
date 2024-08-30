import "cypress-real-events/support";

describe('Map Site Menus and Export to Excel', () => {
  before(() => {
    cy.visit('[siteHere]');
    cy.get('[data-testid="email-input"]').type('[emailHere]');
    cy.get('#password').type('[passHere]');
    cy.get('#btn-login').click();
  });

  it('Extracts menu items and generates Excel', () => {
    const menus = {};

    cy.get('.ui.item.simple.dropdown').each(($menu, index, $list) => {
      const menuName = $menu.find('div.divider.text').text().trim();
      cy.log(`Processing menu: ${menuName}`);
      console.log(`Processing menu: ${menuName}`);

      cy.wrap($menu).realHover().then(() => {
        cy.wait(1000);  // Aguarda o submenu abrir
        cy.wrap($menu).find('.menu.transition .item').then(($subMenuItems) => {
          const items = [];
          $subMenuItems.each((i, el) => {
            const itemText = Cypress.$(el).text().trim();
            cy.log(`Found submenu item: ${itemText}`);
            console.log(`Found submenu item: ${itemText}`);
            items.push(itemText);
          });
          menus[menuName] = items;
        });
      });
    }).then(() => {
      cy.log(`Menus: ${JSON.stringify(menus)}`);
      console.log(`Menus: ${JSON.stringify(menus)}`);

      cy.task('generateExcel', menus);

      cy.log('Excel file generated');
      console.log('Excel file generated');
    });
  });
});
