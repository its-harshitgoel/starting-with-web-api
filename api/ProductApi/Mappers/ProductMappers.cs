using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Npgsql.Internal;
using ProductApi.DTOs.Product;
using ProductApi.Models;

namespace ProductApi.Mappers
{
    public static class ProductMappers //why static? what do you mean by extension method
    {
        public static ProductDto ToProductDto(this Product productModel)
        {
            return new ProductDto
            {
                Id = productModel.Id,
                Name = productModel.Name,
                Quantity = productModel.Quantity,
                Price = productModel.Price,
                Description = productModel.Description
            };
        }
    }
}