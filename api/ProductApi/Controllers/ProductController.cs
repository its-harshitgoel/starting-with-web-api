using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ProductApi.Data;
using ProductApi.DTOs.Product;
using ProductApi.Mappers;

namespace ProductApi.Controllers
{
    [Route ("api/product")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDBContext _context; // why readonly and private and why _context?
        public ProductController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var products = _context.Product.ToList()
            .Select(s => s.ToProductDto());
            return Ok(products);
        }

        [HttpGet("{id}")]
        public IActionResult GetById([FromRoute] int id)
        {
            var product = _context.Product.Find(id);
            if(product == null)
            {
                return NotFound();
            }

            return Ok(product.ToProductDto());
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateProductRequestDto productDto)
        {
            var productModel = productDto.ToProductFromCreateDTO();
            _context.Product.Add(productModel);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = productModel.Id }, productModel.ToProductDto());
        }

        [HttpPut("{id}")]
        public IActionResult Update([FromRoute] int id, [FromBody] UpdateProductRequestDto productDto)
        {
            var productModel = _context.Product.FirstOrDefault(x => x.Id == id);
            if(productModel == null)
            {
                return NotFound();
            }

            productModel.Name = productDto.Name;
            productModel.Price = productDto.Price;
            productModel.Quantity = productDto.Quantity;

            _context.SaveChanges();
            return Ok(productModel.ToProductDto());
        } 

        [HttpDelete("{id}")]

        public IActionResult Delete([FromRoute] int id)
        {
            var productModel = _context.Product.FirstOrDefault(x => x.Id == id);
            if(productModel == null)
            {
                return NotFound();
            }
            _context.Product.Remove(productModel);
            _context.SaveChanges();
            return NoContent();
        }

    }
}