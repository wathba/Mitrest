using System.Security.Claims;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MetApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController(SignInManager<AppUser> signInManager) : ControllerBase
    {
        private readonly SignInManager<AppUser> signInManager = signInManager;
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDTO registerDTO)
        {
            var user = new AppUser
            {
                FirstName = registerDTO.FirstName,
                LastName = registerDTO.LastName,
                Email = registerDTO.Email,
                UserName = registerDTO.Email
            };

             var result = await signInManager.UserManager.CreateAsync(user, registerDTO.Password);
                  await signInManager.UserManager.AddToRoleAsync(user, "Member");
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
                return ValidationProblem();
            }



            return Ok();
        }
        [Authorize]
        [HttpPost("logout")]
        public async Task<ActionResult> Logout()
        {
            await signInManager.SignOutAsync();
          

            return NoContent();
        }

        [HttpGet("user-info")]
        public async Task<ActionResult> GetUserInfo()
        {
            if (User.Identity?.IsAuthenticated == false) return NoContent();

            var user = await signInManager.UserManager.FindByNameAsync(User.Identity?.Name!);

            return Ok(new
            {
                user?.FirstName,
                user?.LastName,
                user?.Email,
                Roles = User.FindFirstValue(ClaimTypes.Role)
            });
        }

        [HttpGet("auth-status")]
        public ActionResult GetAuthState()
        {
            return Ok(new { IsAuthenticated = User.Identity?.IsAuthenticated ?? false });
        }
        

    }
}