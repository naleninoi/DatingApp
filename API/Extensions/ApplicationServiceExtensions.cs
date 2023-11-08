using API.Interfaces;
using API.Services;
using API.Data;
using Microsoft.EntityFrameworkCore;
using API.Helpers;
using API.SignalR;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddSingleton<PresenceTracker>();
            
            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));

            services.AddScoped<ITokenService, TokenService>();

            services.AddScoped<UserActivityLogger>();

            services.AddScoped<IPhotoService, PhotoService>();

            services.AddScoped<IUserRepository, UserRepository>();

            services.AddScoped<ILikesRepository, LikesRepository>();
            
            services.AddScoped<IMessageRepository, MessageRepository>();

            services.AddAutoMapper(typeof(AutomapperProfiles).Assembly);
            
            services.AddDbContext<DataContext>(options =>
            {
                options.UseSqlite(config.GetConnectionString("DefaultConnection"));
            });

            return services;
        }
    }
}  