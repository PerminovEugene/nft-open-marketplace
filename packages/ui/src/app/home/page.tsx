import Link from "next/link";
import React from "react";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white">
        <div className="container mx-auto px-6 py-20 flex flex-col-reverse md:flex-row items-center">
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to NFT Marketplace
            </h1>
            <p className="mb-6">Explore, buy and sell uniq NFTs.</p>
            <a
              href="#"
              className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-200"
            >
              Explore NFT
            </a>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://via.placeholder.com/500"
              alt="NFT Art"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Избранные Коллекции
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Коллекция 1 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src="https://via.placeholder.com/400x300"
              alt="Collection 1"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">Коллекция Артов</h3>
              <p className="text-gray-600">
                Уникальные цифровые произведения искусства.
              </p>
            </div>
          </div>
          {/* Коллекция 2 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src="https://via.placeholder.com/400x300"
              alt="Collection 2"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">Коллекция Музыки</h3>
              <p className="text-gray-600">
                Эксклюзивные музыкальные треки и альбомы.
              </p>
            </div>
          </div>
          {/* Коллекция 3 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src="https://via.placeholder.com/400x300"
              alt="Collection 3"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">
                Коллекция Виртуальных Земель
              </h3>
              <p className="text-gray-600">
                Участки в виртуальных мирах и метавселенных.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending NFTs */}
      <section className="bg-gray-50 container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Популярные NFT
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* NFT 1 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src="https://via.placeholder.com/400x400"
              alt="NFT 1"
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">NFT Арт #1</h3>
              <p className="text-gray-600">Цена: 2 ETH</p>
            </div>
          </div>
          {/* NFT 2 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src="https://via.placeholder.com/400x400"
              alt="NFT 2"
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">NFT Арт #2</h3>
              <p className="text-gray-600">Цена: 3.5 ETH</p>
            </div>
          </div>
          {/* NFT 3 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src="https://via.placeholder.com/400x400"
              alt="NFT 3"
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">NFT Арт #3</h3>
              <p className="text-gray-600">Цена: 1.8 ETH</p>
            </div>
          </div>
          {/* NFT 4 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src="https://via.placeholder.com/400x400"
              alt="NFT 4"
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">NFT Арт #4</h3>
              <p className="text-gray-600">Цена: 4 ETH</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
