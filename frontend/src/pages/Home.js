import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.css';

import slide1 from '../images/40.jpg';
import slide2 from '../images/50.jpg';
import slide3 from '../images/60.jpg';
import blogImage1 from '../images/Blog1.jpg';
import blogImage2 from '../images/Blog2.jpg';
import blogImage3 from '../images/Blog3.jpg';
import blogImage4 from '../images/Blog4.jpg';

import newBlogImage1 from '../images/newBlog1.jpg';
import newBlogImage2 from '../images/newBlog2.jpg';
import newBlogImage3 from '../images/newBlog3.jpg';
import newBlogImage4 from '../images/newBlog4.jpg';

const newBlogItems = [
  { id: 1, title: "รักน้องต้องห้ามทำ! ทำไมถึงห้ามไม่ให้สัตว์เลี้ยงกินอาหารคน", image: newBlogImage1, link: "https://www.ofm.co.th/blog/toxic-food-for-dogs/" },
  { id: 2, title: "โรงพยาบาลสัตว์ที่คัดสรรมาในปี 2024", image: newBlogImage2, link: "https://www.livinginsider.com/inside_topic/9960" },
  { id: 3, title: "สัตว์อะไรมาในฤดูฝน?", image: newBlogImage3, link: "https://www.wellcome-evolution.com/content/6681" },
  { id: 4, title: "ดูแลสุนัขสูงวัยยังไงดี...", image: newBlogImage4, link: "https://www.royalcanin.com/th/dogs/health-and-wellbeing" },
];

const blogItems = [
  { id: 1, title: "Fruits for Dogs", image: blogImage1, link: "https://pets.baanlaesuan.com/157867/pet-food/fruits-for-dogs" },
  { id: 2, title: "Pet Care Products", image: blogImage2, link: "https://www.sanook.com/horoscope/235505/" },
  { id: 3, title: "Choosing the Perfect Pet", image: blogImage3, link: "https://www.petexpothailand.net/page-exhibitor-application.php" },
  { id: 4, title: "Bonding with Your Pet", image: blogImage4, link: "https://hdmall.co.th/blog" },
];

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  // eslint-disable-next-line
  const [currentBlogIndex, setCurrentBlogIndex] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBlogIndex((prevIndex) => (prevIndex + 1) % newBlogItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredItems = blogItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="home">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <Slider {...settings}>
        <div><img src={slide1} alt="Slide 1" /></div>
        <div><img src={slide2} alt="Slide 2" /></div>
        <div><img src={slide3} alt="Slide 3" /></div>
      </Slider>

      <div className="blog-list">
        <h2>Pet Blog</h2>
        <div className="blogs">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <div key={item.id} className="blog-item">
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  <img src={item.image} alt={item.title} />
                  <div className="title">{item.title}</div>
                </a>
              </div>
            ))
          ) : (
            <p>No blogs found</p>
          )}
        </div>
      </div>

      <div className="scrollable-message-box">
        <h3>สาระสัตว์เลี้ยง</h3>
        <div className="blog-box">
          {newBlogItems.map((item) => (
            <div key={item.id} className="blog-item">
              <img src={item.image} alt={item.title} className="selected-blog-image" />
              <div className="blog-title">{item.title}</div>
              <a href={item.link} target="_blank" rel="noopener noreferrer">Read more...</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
