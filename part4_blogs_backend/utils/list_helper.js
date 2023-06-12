
const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const likesSum = Object.keys(blogs).reduce(function (previous, key) {
    return previous + blogs[key].likes;
  }, 0);

  return likesSum
}

const mostLiked = (blogs) => {
  const copiedBlogs = blogs.map(a => { return { ...a } });
  const sortedBlogs = copiedBlogs.sort((a, b) => b.likes - a.likes)
  return sortedBlogs[0]
}

const mostBlogs = () => {
  let totalBlogs = {};
  blogs.forEach(blog => totalBlogs[blog.author] = totalBlogs[blog.author] === undefined ? 1 : totalBlogs[blog.author] + 1);

  let mostBlogsAuthor = null;
  return mostBlogsAuthor
/* 



  


  totalBlogs.sort((a, b) => b.likes - a.likes)



  const copiedBlogs = blogs.map(a => { return { ...a } });


  const authorBlogs = copiedBlogs.reduce((op, { author, likes }) => {
    op[author] = op[author] || 0
    op[author] += likes
    return op
  }, {})

  return authorBlogs[0] */
}

module.exports = {
  dummy,
  totalLikes,
  mostLiked
}





/* 
const reverse = (string) => {
  return string
    .split('')
    .reverse()
    .join('')
}

const average = array => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return array.length === 0
    ? 0
    : array.reduce(reducer, 0) / array.length
}

module.exports = {
  reverse,
  average,
} */