<template>
  <div class="about">
    <br>
    <h1 class="title">About</h1>
    <b-container class="narrow-container">
      <b-row class="my-4">
        <b-col>
          <p>Welcome to Advanced Recipe Management Website, the ultimate destination for culinary enthusiasts! We are a group of passionate third-year Software and Information Systems Engineering students at Ben-Gurion University of the Negev. Inspired by our love for food and technology, we created this innovative platform to celebrate and preserve the rich tapestry of culinary traditions.</p>
          <p>Our mission is to revolutionize the way you discover, store, and share recipes. Advanced Recipe Management Website offers an extensive collection of diverse family recipes that you can access with the click of a button. Whether you're looking to recreate nostalgic flavors or explore new dishes, our platform connects you with a global community of food lovers.</p>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <h3 class="subtitle">What We Offer</h3>
          <ul>
            <li><strong>Explore Recipes:</strong> Dive into our vast database of recipes. From traditional family classics to modern dishes, find exactly what you’re looking for with our advanced search features.</li>
            <li><strong>Preserve Your Culinary Heritage:</strong> Don’t let your family's treasured recipes be forgotten. Document them in your digital recipe box to keep them alive for generations.</li>
            <li><strong>Share and Connect:</strong> Share your culinary creations with a community that celebrates diverse food cultures. Connect with other users to exchange recipes, cooking tips, and personal food stories.</li>
            <li><strong>Personalize Your Experience:</strong> Save your favorite recipes, create custom collections, and track your culinary journey with personalized recommendations.</li>
            <li><strong>Interactive Tools:</strong> Make cooking fun and easy with tools that help you adjust portion sizes and and substitute ingredients.</li>
          </ul>
        </b-col>
      </b-row>
      <b-row class="my-4">
        <b-col>
          <p class="lead">Join Our Community</p>
          <p>At Advanced Recipe Management Website, we believe that every recipe has a story. Join us in creating a vibrant community where those stories are celebrated, shared, and preserved. Whether you’re a home cook or a culinary aficionado, Advanced Recipe Management Website is your go-to platform for all things cooking.</p>
          <p>Experience the joy of cooking like never before. Start your culinary adventure with us today!</p>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="4" class="mb-4" v-for="member in teamMembers" :key="member.name">
          <div class="team-member">
            <img :src="member.image" class="member-image mb-3" alt="Team member image">
            <h5>{{ member.name }}</h5>
            <p>{{ member.bio }}</p>
            <a v-if="member.projectLink" :href="member.projectLink" target="_blank">Previous Project</a>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <br>
  </div>
</template>

<script>
export default {
  name: "About",
  data() {
    return {
      teamMembers: [
        {
          name: "Oded Atias",
          image: 'https://raw.githubusercontent.com/WED-2023/assignment2-1-315071910_311394365_31655631/main/photos/oded_pic.jpeg',
          // bio: "Oded is passionate about web development, focusing on front-end technologies. He enjoys creating interactive and user-friendly interfaces.",
          projectLink: "https://github.com/WED-2023/311394365"
        },
        {
          name: "Amit Avraham",
          image: "https://raw.githubusercontent.com/WED-2023/assignment2-1-315071910_311394365_31655631/main/photos/amit_pic.jpeg",
          // bio: "Amit specializes in full-stack development and loves creating seamless user experiences. He ensures the integration between front-end and back-end systems runs smoothly.",
          projectLink: "https://github.com/WED-2023/315071910"
        },
        {
          name: "Barak Haziz",
          image: 'https://raw.githubusercontent.com/WED-2023/assignment2-1-315071910_311394365_31655631/main/photos/barak_pic.jpeg',
          // bio: "Barak has a knack for backend systems and database management, ensuring smooth and efficient operations. He focuses on optimizing performance and reliability.",
          projectLink: "https://github.com/BarakHaziz"
        }
      ]
    };
  }
};
</script>

<style scoped>
.narrow-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

h1, .subtitle {
  color: #007bff;
  font-size: 2.5rem;
}

p.lead, p {
  font-size: 1.25rem;
  color: #6c757d;
}

.team-member {
  text-align: center;
}

.member-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #007bff;
}

.team-member h5 {
  font-size: 1.25rem;
  color: #343a40;
}

.team-member p {
  color: #6c757d;
}

.team-member a {
  color: #007bff;
  text-decoration: none;
}

.team-member a:hover {
  text-decoration: underline;
}

.title {
  font-size: 72px;
  text-transform: uppercase;
  font-weight: 700;
  font-family: 'Josefin Sans', sans-serif;
  color: #868f4e; /* dark Brown */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3), 0 0 10px rgba(154, 154, 26, 0.7); /* Shadow and red glow */
  margin-bottom: 30px;
  text-align: center;
}
</style>
