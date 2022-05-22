describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user1 = { username: 'root', name: 'root', password: 'root' }
    cy.request('POST', 'http://localhost:3003/api/users', user1)
    const user2 = { username: 'admin', name: 'admin', password: 'admin' }
    cy.request('POST', 'http://localhost:3003/api/users', user2)
    cy.visit('http://localhost:3000')
  })

  it('login form is shown', function () {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
  })

  describe('login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('root')
      cy.get('#password').type('root')
      cy.get('button:contains("login")').click()

      cy.contains('root logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('wrong')
      cy.get('#password').type('wrong')
      cy.get('button:contains("login")').click()

      cy.get('#notification').should(
        'have.text',
        'invalid username or password'
      )
      cy.get('#notification').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('when user1 logged in', function () {
    beforeEach(function () {
      cy.get('#username').type('root')
      cy.get('#password').type('root')
      cy.get('button:contains("login")').click()
    })

    it('A blog can be created', function () {
      cy.get('button:contains("create new blog")').click()
      cy.get('#title').type('test title')
      cy.get('#author').type('test author')
      cy.get('#url').type('test url')
      cy.get('#createButton').click()
      cy.get('#notification').should(
        'have.text',
        'a new blog test title by test author added'
      )
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.get('button:contains("create new blog")').click()
        cy.get('#title').type('another test title')
        cy.get('#author').type('another test author')
        cy.get('#url').type('another test url')
        cy.get('#createButton').click()
      })

      it('it can be liked', function () {
        cy.contains('another test title another test author')
          .parent()
          .as('theBlog')

        cy.get('@theBlog').find('button:contains("view")').click()
        cy.get('@theBlog').find('button:contains("like")').click()
        cy.get('@theBlog').contains('likes 1')
      })

      it('it can be deleted', function () {
        cy.contains('another test title another test author')
          .parent()
          .as('theBlog')

        cy.get('@theBlog').find('button:contains("view")').click()
        cy.get('@theBlog').find('button:contains("remove")').click()

        cy.get('#notification').should(
          'have.text',
          'blog another test title by another test author removed'
        )
      })

      it('it can not be deleted by users other than user1', function () {
        cy.get('button:contains("logout")').click()
        cy.get('#username').type('admin')
        cy.get('#password').type('admin')
        cy.get('button:contains("login")').click()

        cy.contains('another test title another test author')
          .parent()
          .as('theBlog')

        cy.get('@theBlog').find('button:contains("view")').click()
        cy.get('@theBlog').find('button:contains("remove")').should('not.exist')
      })
    })

    describe('and some blogs exists', function () {
      beforeEach(function () {
        for (let index = 1; index < 4; index++) {
          cy.get('button:contains("create new blog")').click()
          cy.get('#title').type(`title${index}`)
          cy.get('#author').type(`author${index}`)
          cy.get('#url').type(`url${index}`)
          cy.get('#createButton').click()
        }
      })

      it('they are ordered according to likes', function () {
        cy.contains('title3 author3').parent().as('blog3')
        cy.get('@blog3').find('button:contains("view")').click()
        cy.get('@blog3').find('button:contains("like")').click()
        cy.waitUntil(function () {
          return cy.get('@blog3').contains('likes 1')
        })
        cy.get('.blogBasic').eq(0).should('have.text', 'title3 author3hide')

        cy.contains('title2 author2').parent().as('blog2')

        cy.get('@blog2').find('button:contains("view")').click()
        cy.get('@blog2').find('button:contains("like")').click()
        cy.waitUntil(function () {
          return cy.get('@blog2').contains('likes 1')
        })
        cy.get('@blog2').find('button:contains("like")').click()
        cy.waitUntil(function () {
          return cy.get('@blog2').contains('likes 2')
        })

        cy.get('.blogBasic').eq(0).should('have.text', 'title2 author2hide')
        cy.get('.blogBasic').eq(1).should('have.text', 'title3 author3hide')
      })
    })
  })
})