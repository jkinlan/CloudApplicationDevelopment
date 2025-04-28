require "test_helper"

class ProductsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @product = Product.create(name: "Test Product", description: "Test Description", price: 9.99)
  end

  test "should get index" do
    get products_url
    assert_response :success
  end

  test "should create product" do
    assert_difference('Product.count') do
      post products_url, params: { product: { name: 'New Product', price: 12.99, description: 'Something' } }
    end
    assert_response :created
  end

  test "should show product" do
    get product_url(@product)
    assert_response :success
  end

  test "should update product" do
    patch product_url(@product), params: { product: { price: 15.99 } }
    assert_response :success
  end

  test "should destroy product" do
    assert_difference('Product.count', -1) do
      delete product_url(@product)
    end
    assert_response :no_content
  end
end
