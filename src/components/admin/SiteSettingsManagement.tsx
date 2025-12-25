import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import {
  getNewSiteSetting,
  updateNewSiteSetting,
  getAllNewBanners,
  createNewBanner,
  updateNewBanner,
  deleteNewBanner,
} from '@/db/api';
import type { SiteBanner } from '@/types/types';
import { Plus, Trash2, Edit, Image, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SiteSettingsManagement() {
  const [logoUrl, setLogoUrl] = useState('');
  const [logoType, setLogoType] = useState<'image' | 'video'>('image');
  const [banners, setBanners] = useState<SiteBanner[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<SiteBanner | null>(null);
  const { toast } = useToast();

  const [bannerForm, setBannerForm] = useState({
    title: '',
    media_url: '',
    media_type: 'image' as 'image' | 'gif',
    link_url: '',
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    loadSettings();
    loadBanners();
  }, []);

  const loadSettings = async () => {
    try {
      const logo = await getNewSiteSetting('site_logo');
      const type = await getNewSiteSetting('site_logo_type');
      
      if (logo) setLogoUrl(logo.setting_value);
      if (type) setLogoType(type.setting_value as 'image' | 'video');
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadBanners = async () => {
    try {
      const data = await getAllNewBanners();
      setBanners(data);
    } catch (error) {
      console.error('Error loading banners:', error);
      toast({
        title: 'Error',
        description: 'Failed to load banners',
        variant: 'destructive',
      });
    }
  };

  const handleSaveLogo = async () => {
    try {
      await updateNewSiteSetting('site_logo', logoUrl, 'image');
      await updateNewSiteSetting('site_logo_type', logoType, 'text');
      
      toast({
        title: 'Success',
        description: 'Logo settings updated successfully',
      });
    } catch (error) {
      console.error('Error saving logo:', error);
      toast({
        title: 'Error',
        description: 'Failed to save logo settings',
        variant: 'destructive',
      });
    }
  };

  const handleSubmitBanner = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingBanner) {
        await updateNewBanner(editingBanner.id, bannerForm);
        toast({
          title: 'Success',
          description: 'Banner updated successfully',
        });
      } else {
        await createNewBanner(bannerForm);
        toast({
          title: 'Success',
          description: 'Banner created successfully',
        });
      }
      
      setDialogOpen(false);
      resetBannerForm();
      loadBanners();
    } catch (error) {
      console.error('Error saving banner:', error);
      toast({
        title: 'Error',
        description: 'Failed to save banner',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      await deleteNewBanner(id);
      toast({
        title: 'Success',
        description: 'Banner deleted successfully',
      });
      loadBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete banner',
        variant: 'destructive',
      });
    }
  };

  const handleEditBanner = (banner: SiteBanner) => {
    setEditingBanner(banner);
    setBannerForm({
      title: banner.title,
      media_url: banner.media_url,
      media_type: banner.media_type,
      link_url: banner.link_url || '',
      display_order: banner.display_order,
      is_active: banner.is_active,
    });
    setDialogOpen(true);
  };

  const handleToggleBanner = async (banner: SiteBanner) => {
    try {
      await updateNewBanner(banner.id, { is_active: !banner.is_active });
      toast({
        title: 'Success',
        description: `Banner ${!banner.is_active ? 'activated' : 'deactivated'}`,
      });
      loadBanners();
    } catch (error) {
      console.error('Error toggling banner:', error);
      toast({
        title: 'Error',
        description: 'Failed to update banner status',
        variant: 'destructive',
      });
    }
  };

  const resetBannerForm = () => {
    setBannerForm({
      title: '',
      media_url: '',
      media_type: 'image',
      link_url: '',
      display_order: 0,
      is_active: true,
    });
    setEditingBanner(null);
  };

  return (
    <div className="space-y-6">
      {/* Logo Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Site Logo</CardTitle>
          <CardDescription>
            Configure your site logo (supports images, GIFs, and videos)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Logo Type</Label>
            <Select
              value={logoType}
              onValueChange={(value) => setLogoType(value as 'image' | 'video')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">Image/GIF</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Logo URL</Label>
            <Input
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>

          {logoUrl && (
            <div className="border rounded-lg p-4 bg-muted/20">
              <p className="text-sm text-muted-foreground mb-2">Preview:</p>
              {logoType === 'video' ? (
                <video
                  src={logoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-20 object-contain"
                />
              ) : (
                <img src={logoUrl} alt="Logo preview" className="h-20 object-contain" />
              )}
            </div>
          )}

          <Button onClick={handleSaveLogo}>Save Logo Settings</Button>
        </CardContent>
      </Card>

      {/* Banners Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Banner Carousel</CardTitle>
              <CardDescription>
                Manage rotating banners and ads (supports images and GIFs)
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetBannerForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Banner
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                  </DialogTitle>
                  <DialogDescription>
                    Create a banner for the homepage carousel
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitBanner} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={bannerForm.title}
                      onChange={(e) =>
                        setBannerForm({ ...bannerForm, title: e.target.value })
                      }
                      placeholder="Banner title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="media_url">Media URL</Label>
                    <Input
                      id="media_url"
                      value={bannerForm.media_url}
                      onChange={(e) =>
                        setBannerForm({ ...bannerForm, media_url: e.target.value })
                      }
                      placeholder="https://example.com/banner.jpg"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Media Type</Label>
                    <Select
                      value={bannerForm.media_type}
                      onValueChange={(value) =>
                        setBannerForm({
                          ...bannerForm,
                          media_type: value as 'image' | 'gif',
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="gif">GIF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="link_url">Link URL (Optional)</Label>
                    <Input
                      id="link_url"
                      value={bannerForm.link_url}
                      onChange={(e) =>
                        setBannerForm({ ...bannerForm, link_url: e.target.value })
                      }
                      placeholder="https://example.com/offer"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={bannerForm.display_order}
                      onChange={(e) =>
                        setBannerForm({
                          ...bannerForm,
                          display_order: parseInt(e.target.value) || 0,
                        })
                      }
                      min="0"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={bannerForm.is_active}
                      onCheckedChange={(checked) =>
                        setBannerForm({ ...bannerForm, is_active: checked })
                      }
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      {editingBanner ? 'Update' : 'Create'} Banner
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setDialogOpen(false);
                        resetBannerForm();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {banners.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No banners created yet. Click "Add Banner" to create one.
            </div>
          ) : (
            <div className="space-y-3">
              {banners.map((banner) => (
                <Card key={banner.id}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="w-24 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                      <img
                        src={banner.media_url}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{banner.title}</h4>
                        <Badge variant={banner.is_active ? 'default' : 'secondary'}>
                          {banner.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline">Order: {banner.display_order}</Badge>
                      </div>
                      {banner.link_url && (
                        <p className="text-sm text-muted-foreground truncate">
                          Link: {banner.link_url}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleBanner(banner)}
                      >
                        {banner.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditBanner(banner)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteBanner(banner.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
