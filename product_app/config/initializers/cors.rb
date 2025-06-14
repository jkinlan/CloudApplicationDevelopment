# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins 'http://ec2-108-129-11-224.eu-west-1.compute.amazonaws.com'  # Your frontend URL
  
      resource '*',
        headers: :any,
        methods: [:get, :post, :put, :delete, :options],
        expose: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Headers']
    end
  end
