const Contact = ({ userID }) => {
    return (
      <div className="contactWrapper flex flex-col md:flex-row items-start p-4 mt-4">
        {/* Left Text Section */}
        <div className="w-full md:w-1/2 pr-4 mb-8 md:mb-0">
          
          <h1 className="text-2xl mb-4" style={{ marginLeft: '20px' }}>
            We'd Love to Hear From You!
          </h1>

          <h2 className="text-xl" style={{ marginLeft: '20px' }}>
            Have questions, feedback, or need assistance? Feel free to reach out to us. 
            Our team is here to help with any inquiries or concerns you may have. 
            Simply fill out the form below, and we'll get back to you as soon as possible.
          </h2>
            
        </div>
  
        {/* Right Form Section */}
        <div className="w-full md:w-1/2">
          <form action="results.php" method="get">
            <div className="mb-4">
              <input
                type="text"
                className="form-control w-full p-2 border border-gray-300 rounded"
                id="name"
                name="name"
                placeholder="Name"
              />
            </div>
  
            <div className="mb-4">
              <input
                type="email"
                className="form-control w-full p-2 border border-gray-300 rounded"
                id="email"
                name="email"
                placeholder="Email"
              />
            </div>
  
            <div className="mb-4">
              <input
                type="tel"
                className="form-control w-full p-2 border border-gray-300 rounded"
                id="phone"
                name="phone"
                placeholder="Phone"
              />
            </div>
  
            <div className="mb-4">
              <textarea
                id="comments"
                className="form-control w-full p-2 border border-gray-300 rounded"
                placeholder="Comments"
              ></textarea>
            </div>
  
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Send Message
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default Contact;