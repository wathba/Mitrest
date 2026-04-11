using Core.Entities;
using Core.Helpers;
using Core.Specifications;
using MetApi.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace MetApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuController : ControllerBase
    {
        private readonly IRepository<MenuItem> _repo;

        public MenuController(IRepository<MenuItem> repo)
        {
            _repo = repo;
        }
        [HttpGet]

        [HttpGet]
        public async Task<ActionResult<Pagination<MenuItem>>> GetMenuItems(
    [FromQuery] MenuItemParams param)
        {
            var spec = new MenuItemSpecification(param);

            var countSpec = new MenuItemCountSpecification(param);

            var count = await _repo.CountAsync(countSpec);

            var data = await _repo.GetWithSpecAsync(spec);

            return Ok(new Pagination<MenuItem>(
                param.PageIndex,
                param.PageSize,
                count,
                [.. data]
            ));
        }
        [HttpGet("{Id}")]
        public async Task<ActionResult> GetMenuById(int Id)
        {
            if (_repo.DoesExistAsync(Id).Result == false) return NotFound();
            var menuItem = await _repo.GetAsync(Id);
            return Ok(menuItem);
        }

        [HttpPost]
        public async Task<ActionResult> AddMenuItem([FromBody] MenuItemDTO menuItemDTO)
        {
            if (!ModelState.IsValid) return BadRequest("Check the field");
            var menuItem = new MenuItem
            {
                Name = menuItemDTO.Name,
                Description = menuItemDTO.Description,
                Price = menuItemDTO.Price,
                PictureUrl = menuItemDTO.PictureUrl,
                Category = menuItemDTO.Category
            };
            await _repo.AddAsync(menuItem);
            await _repo.SaveAsync();
            return CreatedAtAction(nameof(GetMenuById), new { Id = menuItem.Id }, menuItem);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateMenuItem(int id,[FromBody] MenuItemUpdateDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Invalid data");

            var exists = await _repo.DoesExistAsync(id);
            if (!exists)
                return NotFound();

            var menuItem = await _repo.GetAsync(id);
            menuItem.Id = id;
            menuItem.Name = dto.Name ?? menuItem.Name;
            menuItem.Description = dto.Description ?? menuItem.Description;
            menuItem.Price = dto.Price ?? menuItem.Price;
            menuItem.PictureUrl = dto.PictureUrl ?? menuItem.PictureUrl;
            menuItem.Category = dto.Category ?? menuItem.Category;

            await _repo.UpdateAsync(menuItem);
            await _repo.SaveAsync();

            return Ok(menuItem);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMenuItem(int id)
        {
            if (!await _repo.DoesExistAsync(id))
                return NotFound();
            var menuItem = await _repo.GetAsync(id);
            await _repo.DeleteAsync(menuItem);
            await _repo.SaveAsync();
            return Ok($"{menuItem.Name} deleted successfully");
        }

    }
}