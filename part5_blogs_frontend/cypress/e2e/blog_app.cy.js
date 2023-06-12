
describe('Blog app',  function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'test_account',
      username: 'fso-user',
      password: 'admin'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })


  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('fso-user')
      cy.get('#password').type('admin')

      cy.get('#login-button').click()
      cy.contains('Logged in: test_account')
    })

    it('fails with wrong credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('fso-user')
      cy.get('#password').type('admin123')

      cy.get('#login-button').click()
      cy.contains('Wrong credentials')
    })
  })


  describe('When logged in', function() {
    beforeEach(function() {
      cy.contains('log in').click()
      cy.get('#username').type('fso-user')
      cy.get('#password').type('admin')

      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('.blog-form-title').type('a note created by cypress')
      cy.get('.blog-form-author').type('cypress')
      cy.get('.blog-form-url').type('cypress.com')
      cy.contains('Add blog').click()
      cy.contains('a note created by cypress')
    })

    it('A blog can be liked', function() {
      cy.contains('new blog').click()
      cy.get('.blog-form-title').type('a note created by cypress')
      cy.get('.blog-form-author').type('cypress')
      cy.get('.blog-form-url').type('cypress.com')
      cy.contains('Add blog').click()
      cy.contains('a note created by cypress')

      cy.contains('View..').click()
      cy.contains('Like').click()
      cy.contains('Remove like')
    })

    it('A blog can be deleted', function() {
      cy.contains('new blog').click()
      cy.get('.blog-form-title').type('a note created by cypress')
      cy.get('.blog-form-author').type('cypress')
      cy.get('.blog-form-url').type('cypress.com')
      cy.contains('Add blog').click()
      cy.contains('a note created by cypress')

      cy.contains('View..').click()
      cy.contains('Delete blog').click()

      cy.get('body')
      cy.should('not.contain', 'a note created by cypress')

    })

    it('Someone else cant delete your blog', function() {
      cy.contains('new blog').click()
      cy.get('.blog-form-title').type('a note created by cypress')
      cy.get('.blog-form-author').type('cypress')
      cy.get('.blog-form-url').type('cypress.com')
      cy.contains('Add blog').click()
      cy.contains('a note created by cypress')

      // Create new user to view the new blog
      const user = {
        name: 'test_account_second',
        username: 'fso-user-second',
        password: 'admin'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user)

      // Logout to view the blog on other account
      cy.contains('Logout').click()

      // Login on other account
      cy.get('#username').type('fso-user-second')
      cy.get('#password').type('admin')

      cy.get('#login-button').click()

      cy.contains('View..').click()

      cy.get('body')

      cy.contains('Delete blog')
        .and('have.css', 'display')
        .should('include', 'none')
    })


    it('Blogs are ordered by likes descending', function() {
      // Blog without likes (default comes first)
      cy.contains('new blog').click()
      cy.get('.blog-form-title').type('Blog without any likes')
      cy.get('.blog-form-author').type('cypress')
      cy.get('.blog-form-url').type('cypress.com')
      cy.contains('Add blog').click()
      cy.contains('Blog without any likes')

      // Blog that we will like
      cy.contains('new blog').click()
      cy.get('.blog-form-title').type('Blog with one like')
      cy.get('.blog-form-author').type('cypress')
      cy.get('.blog-form-url').type('cypress.com')
      cy.contains('Add blog').click()
      cy.contains('Blog with one like')

      // Like the second post
      cy.get('.show-button').eq(1).click()
      cy.get('.like-button').eq(1).click()

      // After liking the post that was added later, it should move up and become the first .like-button in the DOM
      cy.get('.like-button').eq(0).contains('Remove like')
    })
  })
})



