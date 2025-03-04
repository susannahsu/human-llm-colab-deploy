import React, {useState, useEffect} from 'react';
import Chat from './Chat';
import WebsitePreview from './WebsitePreview';
import './App.css';

function App() {
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    let name;
    while(!name) {
      name = prompt('Enter your name:');
      if (name) {
        setUserName(name);
      }
    }
  }, []);

  const [htmlString, setHtmlString] = useState(`
    <div class="website-preview">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Single Page Navigation</title>
        <style>
          html,
          body {
            height: 100%;
            display: flex;
            flex-direction: column;
            min-height: 100%;
          }

          .website-preview {
            display: flex;
            flex-direction: column;
            height: 100%;
            background-color: #fff;
            border: 1px solid #ccc;
          }

          .header {
            background-color: #333;
            color: #fff;
            padding: 15px;
          }
          
          .header h1 {
            margin: 0;
          }
          
          .nav ul {
            list-style-type: none;
            padding: 0;
            display: flex;
          }
          
          .nav li {
            margin-right: 15px;
          }
          
          .nav a {
            color: #fff;
            text-decoration: none;
          }
          
          .main-content {
            flex: 1;
            padding: 20px;
          }
          
          .footer {
            background-color: #333;
            color: #fff;
            padding: 10px;
            text-align: center;
          }
          
          .nav button {
            background: none;
            border: none;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
          }
          
          .nav button:hover,
          .nav button.active {
            text-decoration: underline;
          }
          
          /* Adjust main content */
          .main-content {
            flex: 1;
            padding: 20px;
            overflow-y: auto; /* Add scrolling if content overflows */
          }
          /* Basic styles for navigation */
          .nav ul {
            list-style: none;
            padding: 0;
          }

          .nav li {
            display: inline;
            margin-right: 20px;
          }

          /* Initially hide all sections */
          .main-content section {
            display: none;
          }
          
          .footer {
            display: block;
          }

          /* Show section when targeted */
          #home:target, #about:target, #contact:target {
            display: block;
          }

          /* Default section when no target is active */
          body:not(:has(:target)) #home {
            display: block;
          }
        </style>
      </head>
      <body>
        <header class="header">
          <h1>My Website</h1>
          <nav class="nav">
            <ul>
              <li><a id="home-btn" href="#home">Home</a></li>
              <li><a id="about-btn" href="#about">About</a></li>
              <li><a id="contact-btn" href="#contact">Contact</a></li>
            </ul>
          </nav>
        </header>

        <main class="main-content">
          <section id="home">
            <h2>Welcome to the Home Page</h2>
            <p>This is the home page of the website.</p>
          </section>

          <section id="about">
            <h2>About Us</h2>
            <p>This is the about page of the website.</p>
          </section>

          <section id="contact">
            <h2>Contact Us</h2>
            <p>This is the contact page of the website.</p>
          </section>
        </main>

        <footer class="footer">
          <p>&copy; 2024 My Website</p>
        </footer>
      </body>
    </div>

    <script>
      const homeBtn = document.getElementById('home-btn');
      const aboutBtn = document.getElementById('about-btn');
      const contactBtn = document.getElementById('contact-btn');

      const homePage = document.getElementById('home');
      const aboutPage = document.getElementById('about');
      const contactPage = document.getElementById('contact');

      function setCurrentPage(e, page) {
        e.preventDefault();
        e.stopPropagation();
        homePage.style.display = page === 'home' ? 'block' : 'none';
        aboutPage.style.display = page === 'about' ? 'block' : 'none';
        contactPage.style.display = page === 'contact' ? 'block' : 'none';

        homeBtn.classList.toggle('active', page === 'home');
        aboutBtn.classList.toggle('active', page === 'about');
        contactBtn.classList.toggle('active', page === 'contact');
      }

      homeBtn.addEventListener('click', (e) => setCurrentPage(e, 'home'));
      aboutBtn.addEventListener('click', (e) => setCurrentPage(e, 'about'));
      contactBtn.addEventListener('click', (e) => setCurrentPage(e, 'contact'));
    </script>


  `);
  return (
    <div className="App">
      <div className="container">
        {/* Chat */}
        <div className="chat-section">
          <Chat htmlString={htmlString} setHtmlString={setHtmlString} userName={userName} />
        </div>

        {/* Website Preview */}
        <div className="website-preview-section">
          <WebsitePreview htmlString={htmlString} />
        </div>
      </div>
    </div>
  );
}

export default App;
