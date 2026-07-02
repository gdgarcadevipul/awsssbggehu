document.getElementById('footer-placeholder').innerHTML = `
  <div class="footer-grid">
    <div>
      <div class="brand" style="margin-bottom:14px;">
        <img src="assets/images/logo.svg" alt="Logo" style="width:34px;">
        <div class="brand-text"><div class="name">AWS STUDENT BUILDER GROUP</div><div class="sub">at [Your Campus Name]</div></div>
      </div>
      <p style="opacity:.8; font-size:14px; max-width:320px;">Turning students into cloud-native engineers, one project at a time — from the heart of the Himalayas.</p>
    </div>
    <div><h4>Navigate</h4><ul>
      <li><a href="about.html">About</a></li><li><a href="events.html">Events</a></li>
      <li><a href="team.html">Team</a></li><li><a href="gallery.html">Gallery</a></li>
    </ul></div>
    <div><h4>Community</h4><ul>
      <li><a href="contact.html">Contact Us</a></li><li><a href="blog.html">Blog</a></li>
      <li><a href="#">Builder Portal</a></li>
    </ul></div>
    <div><h4>Connect</h4><ul>
      <li><a href="mailto:yourgroup@example.com">Email Us</a></li>
      <li><a href="#" target="_blank">LinkedIn</a></li>
      <li><a href="#" target="_blank">Instagram</a></li>
    </ul></div>
  </div>
  <div class="footer-bottom">© ${new Date().getFullYear()} AWS Student Builder Group — [Your Campus Name]. Built by student builders.</div>
`;