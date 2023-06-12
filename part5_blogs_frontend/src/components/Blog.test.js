import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Blog from './Blog'
import BlogForm from './BlogForm'

describe('<Blog />', () => {
  const mockHandler = jest.fn()

  const blog = {
    'title': 'Component testing is done with react-testing-library',
    'author': 'Liked person',
    'url': 'notreact.com',
    'likes': 19,
    'likedBy': [],
    'user': {
      'username': 'fso-user',
      'name': 'test_account',
      'id': '648584e5dda51afc76e4941f'
    },
    'id': '6485ff9b9975f24d617aa318'
  }

  const user12 = {
    id: '648584e5dda51afc76e4941f',
    name: 'test_account',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImZzby11c2VyIiwiaWQiOiI2NDg1ODRlNWRkYTUxYWZjNzZlNDk0MWYiLCJpYXQiOjE2ODY1MTI3MzN9.f3kSXgUfzpVW9-YkIZGmNI9fnDP4foSGDmotnuyC3yA',
    username: 'fso-user'
  }

  let container

  beforeEach(() => {
    container = render(<Blog key={blog.id} blog={blog} user={user12} likeBlog={mockHandler} />).container
  })

  test('renders content', () => {
    expect(container).toHaveTextContent('Component testing is done with react-testing-library' )
    expect(container).toHaveTextContent('Liked person')

    // Details hidden by default
    const details = container.querySelector('.detailedInfo')
    expect(details).toHaveStyle('display: none')
  })

  // Details open on click
  test('after clicking the button, details are displayed', async () => {
    const user = userEvent.setup()
    const button = container.querySelector('.show-button')
    await user.click(button)

    const details = container.querySelector('.detailedInfo')
    expect(details).not.toHaveStyle('display: none')
  })

  // Like button is hit twice
  test('like button calls function properly', async () => {
    const user = userEvent.setup()
    const button = container.querySelector('.like-button')
    await user.click(button)
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })



  test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const createBlog = jest.fn()
    const user = userEvent.setup()

    let blogFormContainer = render(<BlogForm createBlog={createBlog} />).container

    const inputTitle = blogFormContainer.querySelector('.blog-form-title')
    const inputAuthor = blogFormContainer.querySelector('.blog-form-author')
    const inputUrl = blogFormContainer.querySelector('.blog-form-url')

    const sendButton = blogFormContainer.querySelector('.blog-form-submit-button')

    await user.type(inputTitle, 'Testing a form...')
    await user.type(inputAuthor, 'Test author')
    await user.type(inputUrl, 'Testing.com')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Testing a form...')
    expect(createBlog.mock.calls[0][0].author).toBe('Test author')
    expect(createBlog.mock.calls[0][0].url).toBe('Testing.com')
  })



})
