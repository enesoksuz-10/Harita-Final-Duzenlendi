using BelsisHarita.Web.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using BelsisHarita.DataAccess;
using BelsisHarita.Entities;
using Newtonsoft.Json;

namespace BelsisHarita.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly HaritaContext context;
        Islemler islem;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
            this.context = new HaritaContext();
            //DbInitializer.Initialize(this.context); İlk çalıştırıldığında açılacak. DB oluştuğunda kapatılacak.
            islem = new Islemler(this.context);
        }

        public IActionResult Index()
        {
            var tumKayitlar = islem.GetAllHaritalar();
            ViewData["tumkayitlar"] = JsonConvert.SerializeObject(tumKayitlar);
            ViewData["kayitlarCount"]=tumKayitlar.Count.ToString();
            return View(tumKayitlar);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public JsonResult getHarita(int id)
        {
            var harita = islem.GetHarita(id);
            return Json(harita);
        }

        [HttpPost]
        public JsonResult addHarita([Bind("Sehir,Ilce,Mahalle,GeoType,Koordinat")] Harita h)
        {
            var eklendi = islem.addHarita(h);
            return Json(eklendi);
        }

        [HttpPost]
        public JsonResult updateHarita([Bind("Sehir,Ilce,Mahalle,Id")] Harita h)
        {
            var duzenlendi = islem.updateHarita(h);
            return Json(duzenlendi);
        }

        public string delHarita(int id)
        {
            var sonuc = islem.delHarita(id);
            if (sonuc)
                return "1";
            else
                return "0";
        }

        public JsonResult getAllHaritalar()
        {
            var haritalar = islem.GetAllHaritalar();
            return Json(haritalar);
        }

    }
}